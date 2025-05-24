"use client"

import { useOneVOne } from '@/context/1v1Context'
import { getSocket } from '@/lib/socket'
import { QuestionWithExamples } from '@/lib/types'
import React, { useEffect, useState } from 'react'
import CodeEditor from "./CodeEditor";

const BattleComponent = () => {

const {userId,setQuestions,setRoomId,roomId,questions} = useOneVOne();
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



if(!questions){
  return <div>loading</div>
}




 const [activeIndex, setActiveIndex] = useState(0);
  const [questionId,setQuestionId] = useState<string>(questions[0].id)
  const question = questions[activeIndex];

  const handleTabSwitch = (index: number) => {
 
    setQuestionId(questions[index].title)
    setActiveIndex(index);
  };


  
  return (
    <div className="flex flex-col md:flex-row h-screen">
      {/* Left Panel */}
      <div className="md:w-1/2 w-full p-4 overflow-y-auto bg-white border-r border-gray-200">
        {/* Tabs */}
        <div className="flex space-x-2 mb-4">
          {questions.map((q, i) => (
            <button
              key={i}
              onClick={() => handleTabSwitch(i)}
              className={`px-4 py-2 rounded ${
                activeIndex === i
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              Q{i + 1}
            </button>
          ))}
        </div>

        {/* Question Content */}
        <h2 className="text-2xl font-bold mb-4">{question.title}</h2>
        <p className="mb-4 text-gray-700">{question.description}</p>

        <h3 className="text-lg font-semibold mb-2">Examples:</h3>
        <div className="space-y-4">
          {question.examples.map((ex, i) => (
            <div key={i} className="p-3 border border-gray-200 rounded bg-gray-50">
              <p><strong>Input:</strong> {ex.input}</p>
              <p><strong>Output:</strong> {ex.output}</p>
              {ex.explanation && (
                <p><strong>Explanation:</strong> {ex.explanation}</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Right Panel */}
       {/* Right Panel */}
      <div className="md:w-1/2 w-full p-4 bg-gray-900 text-white overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4">Your Code</h2>
        <div className="h-[85vh] border border-gray-700 rounded overflow-hidden">
<CodeEditor userId={userId!} questionId={questionId} roomId={"1"}/>
        </div>
      </div>
    </div>
  );

}

export default BattleComponent