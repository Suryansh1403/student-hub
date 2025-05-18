"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getSocket } from "@/lib/socket";
import { useOneVOne } from "@/context/1v1Context";
import { QuestionWithExamples } from "@/lib/types";

export default function ClientRoomPage({
  // roomId,
  join,
}: {
  // roomId: string;
  join: string;
}) {
  const router = useRouter();
  const { userId, setQuestions,roomId } = useOneVOne();
  const socket = getSocket();

  useEffect(() => {
    if (!userId || !roomId || !join) return;

    const handleConnect = () => {
      if (join === "no") {
        socket.emit("create-room", { roomId, userId });
      } else {
        socket.emit("join-room", { roomId, userId });
      }
    };

    // Only emit if connected, or wait for connect
    if (socket.connected) {
      handleConnect();
    } else {
      socket.on("connect", handleConnect);
    }

    // Wait state
    const handleWaiting = () => {
      console.log("Waiting...");
    };

    const handleStartMatch = ({
      question,
    }: {
      question: QuestionWithExamples[];
    }) => {
      console.log("start match")
      if (question) {
        setQuestions(question);
        router.push(`/1v1/${roomId}/battle`);
      }
    };

    socket.on("waiting", handleWaiting);
    socket.on("start-match", handleStartMatch);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("waiting", handleWaiting);
      socket.off("start-match", handleStartMatch);
      // ❌ Don’t disconnect globally shared socket here
    };
  }, [roomId, userId, join]);

  return (
    <div className="flex items-center justify-center h-screen flex-col space-y-4">
      <h1 className="text-3xl font-bold">Room ID: {roomId}</h1>
      <p className="text-xl">You: {userId}</p>
      <p className="text-gray-600">Waiting for opponent...</p>
    </div>
  );
}
