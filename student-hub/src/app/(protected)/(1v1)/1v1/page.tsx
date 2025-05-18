
"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import { useOneVOne } from "@/context/1v1Context";
export default function JoinRoom() {
  const [roomCode, setRoomCode] = useState("");
  const router = useRouter();
const OneVOneContext = useOneVOne()

  const handleCreateRoom = () => {
    const newRoomId = uuidv4(); 
    OneVOneContext.setRoomId(newRoomId)
    localStorage.setItem("roomid",newRoomId)
    router.push(`/1v1/${newRoomId}`);
  };

  const handleJoinRoom = () => {
    if (!roomCode) return;
    OneVOneContext.setRoomId(roomCode)
    localStorage.setItem("roomid",roomCode)
    router.push(`/1v1/${roomCode}/join`);

  };

  return (
    <div className="flex items-center justify-center h-screen">
      <Card className="w-full max-w-md p-6 space-y-4">
        <CardContent className="space-y-4">
          <h2 className="text-2xl font-bold text-center">Join 1v1 Battle</h2>


          <div className="flex gap-2">
            <Button className="w-full" onClick={handleCreateRoom} >
              Create Room
            </Button>
          </div>

          <div className="space-y-2 pt-4">
            <Input
              placeholder="Enter Room Code"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value)}
            />
            <Button className="w-full" onClick={handleJoinRoom} disabled={ !roomCode}>
              Join Room
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
