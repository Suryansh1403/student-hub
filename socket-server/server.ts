import { Server as SocketIOServer } from "socket.io";
import { createServer } from "http";
import express from "express";
import axios from "axios";

const NEXT_API_URL = "http://localhost:3000"; 
const app = express();
const httpServer = createServer(app);
const io = new SocketIOServer(httpServer, {
  cors: {
    origin: "*", // Set this properly in production
  },
});
type LeaderboardEntry = {
  userId: string;
  // username: string;
  totalCorrect: number;
  totalAttempts: number;
  perQuestionStats: {
    [questionId: string]: {
      attempts: number;
      isCorrect: boolean;
    };
  };
  score:number
};
type Player = {
  socketId: string;
  userId: string;
  disconnected:boolean
};


type Room = {
  players: Player[];
  status: "waiting" | "active";
  question?: any[]; // Store question once
  leaderboard?: LeaderboardEntry[];
  startTime?: number; // in ms
  endTime?: number; 
  timer? : any
};

const rooms: Record<string, Room> = {};

async function fetchQuestion() {
  try {
    const res = await axios.get(`${NEXT_API_URL}/api/get-question`);
    
        return res.data.questions;
  } catch (error:any) {
    console.error("❌ Error fetching question:", error?.message);
    return null;
  }
}



async function submitContestResult(
  {roomId,winnerId,reason,p1,p2,leaderboard}:
  {roomId:string,winnerId:string|null,reason:string,p1:string,p2:string,leaderboard:LeaderboardEntry[]|undefined}
) {
  const response = await fetch(`${NEXT_API_URL}/api/code/result`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      roomId: roomId,
      winnerId: winnerId, // or null if no winner
      reason: reason,   // or "time"
      participants: [p1,p2],
      leaderboard:leaderboard
    }),
  });

  const data = await response.json();
return data
}

io.on("connection",  (socket) => {
  console.log(`🔌 Socket connected: ${socket.id}`);

  socket.on("create-room", ({ roomId, userId }) => {
    if (rooms[roomId]) {
      socket.emit("room-exists");
      return;
    }

    rooms[roomId] = {
      players: [{ socketId: socket.id, userId,disconnected:false }],
      status: "waiting",
    };

    socket.join(roomId);
    console.log(`✅ Room created: ${roomId}`);
    socket.emit("waiting");
  });

  // Join Room
socket.on("join-room", async ({ roomId, userId }) => {
  let room = rooms[roomId];

  if (!room) {
    socket.emit("room-not-found");
    return;
  }
  const player = room.players.find(p => p.userId === userId)
  if (player) {
     player.disconnected=false;
    room.players = room.players.map(p =>
      p.userId === userId ? { ...p, socketId: socket.id } : p
    );
    socket.join(roomId);
    console.log(`🔁 User rejoined room: ${roomId}`);
      socket.emit("start-match", {

      question: room.question,
      leaderboard:room.leaderboard,
      endTime:room.endTime
    });
  } else if (room.players.length < 2) {
    room.players.push({ socketId: socket.id, userId,disconnected:false });
    socket.join(roomId);
   
    console.log(`👥 User joined room: ${roomId}`);
  } else {
    socket.emit("room-full");
    return;
  }


  if (room.players.length === 2) {
    if (!room.question) {
      const question = await fetchQuestion();
      if (!question) {
        io.to(roomId).emit("error", { message: "Failed to load question" });
        return;
      }
      room.question = question;
      room.status = "active";
      room.leaderboard=[]
        const durationMs = 1 * 60 * 1000; // 30 minutes
room.startTime = Date.now();
room.endTime = Date.now() + durationMs;
room.timer = setTimeout(async () => {
    await submitContestResult({roomId,winnerId:userId,reason:"time",p1:room.players[0].userId,p2:room.players[1].userId,leaderboard:room.leaderboard})

    io.to(roomId).emit("contest-ended", {winner:null, reason: "time", leaderboard: room.leaderboard });
    delete rooms[roomId]
}, 1 * 60 * 1000);
      if(room.question)
      io.to(roomId).emit("start-match", {
    
        question: room.question,
        leaderboard:room.leaderboard,
        startTime:room.startTime,
        endTime:room.endTime
      });
    }

  } else {
    socket.emit("waiting");
  }
});

socket.on("leaderboard-update",async ({roomId, userId,score,questionId,correct})=>{
console.log({roomId, userId,score,questionId,correct})
const room = rooms[roomId]

if(!room) return

function updateLeaderboard(
  room: Room,
  userId: string,
  score: number,
  questionId: string,
  correct: boolean
) {
  if (!room.leaderboard) room.leaderboard = [];

  let entry = room.leaderboard.find((e) => e.userId === userId);

  if (!entry) {
    entry = {
      userId,
      score: 0,
      totalAttempts: 0,
      totalCorrect: 0,
      perQuestionStats: {},
    };
    room.leaderboard.push(entry);
  }

  // Initialize question stats if not already
  if (!entry.perQuestionStats[questionId]) {
    entry.perQuestionStats[questionId] = {
      attempts: 0,
      isCorrect: false,
    };
  }

  const questionStats = entry.perQuestionStats[questionId];

  // Update attempts
  questionStats.attempts += 1;
  entry.totalAttempts += 1;

  // Only update score and totalCorrect if first time solving correctly
  if (correct && !questionStats.isCorrect) {
    questionStats.isCorrect = true;
    entry.score += score;
    entry.totalCorrect += 1;


  }

  // Sort leaderboard based on score and then fewer attempts (tie breaker)
  room.leaderboard.sort((a, b) =>
    b.score !== a.score ? b.score - a.score : a.totalAttempts - b.totalAttempts
  );

  const values = Object.values(entry.perQuestionStats);

  const result = values.length ===3 &&   values.every((stat) => stat.isCorrect === true);
  if (result) {
    clearTimeout(room.timer); 
    submitContestResult({roomId,winnerId:userId,reason:"winner",p1:room.players[0].userId,p2:room.players[1].userId,leaderboard:room.leaderboard})
    io.to(roomId).emit("contest-ended", { winner: userId, reason: "winner", leaderboard: room.leaderboard });

    delete rooms[roomId]
  }

}

updateLeaderboard(room,userId,score,questionId,correct)
console.log(room.leaderboard)
io.to(roomId).emit("leaderboard-update",{leaderboard:room.leaderboard})

})

socket.on("disconnect", () => {
  
  for (const roomId in rooms) {
    const room = rooms[roomId];
const player = room.players.find(p => p.socketId === socket.id);
console.log("disconnecting",player?.userId)

}
});

});

// Start server
const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`🚀 Socket.IO server running on port ${PORT}`);
});


