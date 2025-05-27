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
enum Difficulty {
  EASY,
  MEDIUM,
  HARD
}

type Room = {
  players: Player[];
  status: "waiting" | "active";
  question?: any[]; // Store question once
  leaderboard?: LeaderboardEntry[];
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
      room,
      question: room.question,
      leaderboard:room.leaderboard
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
      if(room.question)


      io.to(roomId).emit("start-match", {
        room,
        question: room.question,
        leaderboard:room.leaderboard
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
