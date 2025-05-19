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

type Player = {
  socketId: string;
  userId: string;
  disconnected:boolean
};

type Room = {
  players: Player[];
  status: "waiting" | "active";
  question?: any[]; // Store question once
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
      io.to(roomId).emit("start-match", {
        room,
        question: room.question,
      });
    }

  } else {
    socket.emit("waiting");
  }
});


socket.on("disconnect", () => {
  
  for (const roomId in rooms) {
    const room = rooms[roomId];
const player = room.players.find(p => p.socketId === socket.id);
console.log("disconnecting",player?.userId)
// if(player){
// player.disconnected = true;
//     if (room.players.length === 0) {
//          setTimeout(() => {
//         const stillDisconnected = room.players.find(
//           p => p.userId === player.userId && p.socketId === null 
//         );

//         if (stillDisconnected && stillDisconnected.disconnected === true) {
//           room.players = room.players.filter(p => p.userId !== player.userId);
//           console.log(`⏳ Removed inactive player ${player.userId} from room ${roomId}`);
//         }

//         if (room.players.length === 0) {
//           delete rooms[roomId];
//           console.log(`🗑️ Deleted empty room: ${roomId}`);
//         }
//       }, 30000);
//     } 
//   }
}
});

});

// Start server
const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`🚀 Socket.IO server running on port ${PORT}`);
});
