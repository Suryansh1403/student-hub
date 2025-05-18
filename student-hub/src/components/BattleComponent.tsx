
"use client"
import { useOneVOne } from '@/context/1v1Context'
import { getSocket } from '@/lib/socket'
import { QuestionWithExamples } from '@/lib/types'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'

const BattleComponent = () => {
    const {questions,userId,setQuestions,setRoomId,roomId} = useOneVOne();
const socket  = getSocket();
useEffect(() => {
  if (!roomId) {
    const r = localStorage.getItem("roomid");
    if (r) setRoomId(r);
  }
}, [roomId]);



useEffect(() => {
 
    if (!userId || !roomId) return;

    const handleConnect = () => {
      console.log("handle connect")
        socket.emit("join-room", { roomId, userId });
    };

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
      }
    };

    socket.on("waiting", handleWaiting);
    socket.on("start-match", handleStartMatch);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("waiting", handleWaiting);
      socket.off("start-match", handleStartMatch);
    };
  }, [roomId, userId]);



  return (
    <div>
      <h2>Battle Started!</h2>
      {questions && questions.map((q:QuestionWithExamples, i) => (
        <div key={q.id}>
          <h3>{q.title}</h3>
          <p>{q.description}</p>
          
        </div>
      ))}
    </div>
  );

}

export default BattleComponent