// 1v1Context.tsx
"use client"
import React, { createContext, useContext, useState, ReactNode } from "react";
import { QuestionWithExamples } from "@/lib/types";
import { getSocket } from "@/lib/socket";
import { Socket } from "socket.io-client";
interface ContestResult {
  winner?: string;
  reason: string;
  leaderboard: { userId: string; score: number }[];
}
interface OneVOneContextType {
  roomId: string | null;
  setRoomId: (id: string) => void;
  userId: string | null;
  questions: QuestionWithExamples[] | null;
  setQuestions: (qs: QuestionWithExamples[]) => void;
    socket: Socket;
  contestResult: ContestResult | null;
  setContestResult: (result: ContestResult) => void;
}

const OneVOneContext = createContext<OneVOneContextType | undefined>(undefined);

export const OneVOneProvider = ({ children,userID }: { children: ReactNode,userID:string }) => {
  const [roomId, setRoomId] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(userID);
  const [questions, setQuestions] = useState<QuestionWithExamples[] | null>(null);
const [contestResult, setContestResultState] = useState<ContestResult | null>(() => {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("contestResult");
    return stored ? JSON.parse(stored) : null;
  }
  return null;
});

const setContestResult = (result: ContestResult) => {
  setContestResultState(result);
  localStorage.setItem("contestResult", JSON.stringify(result));
};
  const socket = getSocket()

  return (
    <OneVOneContext.Provider
      value={{ roomId, setRoomId, userId, questions, setQuestions,socket,contestResult,setContestResult }}
    >
      {children}
    </OneVOneContext.Provider>
  );
};

export const useOneVOne = () => {
  const context = useContext(OneVOneContext);
  if (!context) {
    throw new Error("useOneVOne must be used within OneVOneProvider");
  }
  return context;
};
