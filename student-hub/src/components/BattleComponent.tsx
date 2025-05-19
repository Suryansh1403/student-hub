"use client"
import { Monaco } from "@monaco-editor/react";
import dynamic from "next/dynamic";

import { useOneVOne } from '@/context/1v1Context'
import { getSocket } from '@/lib/socket'
import { QuestionWithExamples } from '@/lib/types'
import { useRouter } from 'next/router'
import React, { useCallback, useEffect, useRef, useState } from 'react'

const BattleComponent = () => {
    const {userId,setQuestions,setRoomId,roomId} = useOneVOne();
const socket  = getSocket();
useEffect(() => {
  if (!roomId) {
    const r = localStorage.getItem("roomid");
    if (r) setRoomId(r);
  }
}, [roomId]);

type Question = {
  title: string;
  description: string;
  examples: {
    input: string;
    output: string;
    explanation?: string;
  }[];
};

// useEffect(() => {
 
//     if (!userId || !roomId) return;

//     const handleConnect = () => {
//       console.log("handle connect")
//         socket.emit("join-room", { roomId, userId });
//     };

//     if (socket.connected) {
//       handleConnect();
//     } else {
//       socket.on("connect", handleConnect);
//     }

//     // Wait state
//     const handleWaiting = () => {
//       console.log("Waiting...");
//     };

//     const handleStartMatch = ({
//       question,
//     }: {
//       question: QuestionWithExamples[];
//     }) => {
//       console.log("start match")
//       if (question) {
//         setQuestions(question);
//       }
//     };

//     socket.on("waiting", handleWaiting);
//     socket.on("start-match", handleStartMatch);

//     return () => {
//       socket.off("connect", handleConnect);
//       socket.off("waiting", handleWaiting);
//       socket.off("start-match", handleStartMatch);
//     };
//   }, [roomId, userId]);

const questions: Question[] = [
  {
    title: "Two Sum",
    description:
      "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
    examples: [
      {
        input: "nums = [2,7,11,15], target = 9",
        output: "[0,1]",
        explanation: "Because nums[0] + nums[1] == 9, we return [0, 1].",
      },
    ],
  },
  {
    title: "Palindrome Number",
    description:
      "Given an integer x, return true if x is a palindrome, and false otherwise.",
    examples: [
      {
        input: "x = 121",
        output: "true",
        explanation: "121 reads as 121 from left to right and right to left.",
      },
      {
        input: "x = -121",
        output: "false",
        explanation: "-121 from left to right is -121. From right to left, it becomes 121-, which is not the same.",
      },
    ],
  },
  {
    title: "Roman to Integer",
    description:
      "Convert a Roman numeral to an integer.",
    examples: [
      {
        input: "s = 'III'",
        output: "3",
      },
      {
        input: "s = 'IV'",
        output: "4",
      },
    ],
  },
];


const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
  loading: () => <p>Loading Editor...</p>,
});


 const [activeIndex, setActiveIndex] = useState(0);
  const [codes, setCodes] = useState<string[]>(["", "", ""]);

  const question = questions[activeIndex];
 const editorRef = useRef<any>(null);

  // Set editor value manually when switching questions
  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.setValue(codes[activeIndex] || "");
    }
  }, [activeIndex]);

  const handleEditorMount = (editor: any) => {
    editorRef.current = editor;
    editor.setValue(codes[activeIndex] || "");
  };

  const handleTabSwitch = (index: number) => {
    // Save current code before switching
    if (editorRef.current) {
      const currentCode = editorRef.current.getValue();
      setCodes(prev => {
        const updated = [...prev];
        updated[activeIndex] = currentCode;
        return updated;
      });
    }

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
          <MonacoEditor
            height="100%"
            theme="vs-dark"
            language="java"
            value={codes[activeIndex]}
            onMount={handleEditorMount}
            options={{
              fontSize: 14,
              minimap: { enabled: false },
              wordWrap: "on",
            }}
          />
        </div>
      </div>
    </div>
  );

}

export default BattleComponent