// 1v1Context.tsx
"use client"
import React, { createContext, useContext, useState, ReactNode } from "react";
import { QuestionWithExamples } from "@/lib/types";
import { getSocket } from "@/lib/socket";

interface OneVOneContextType {
  roomId: string | null;
  setRoomId: (id: string) => void;
  userId: string | null;
  questions: QuestionWithExamples[] | null;
  setQuestions: (qs: QuestionWithExamples[]) => void;
}

const OneVOneContext = createContext<OneVOneContextType | undefined>(undefined);

export const OneVOneProvider = ({ children,userID }: { children: ReactNode,userID:string }) => {
  const [roomId, setRoomId] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(userID);
  const [questions, setQuestions] = useState<QuestionWithExamples[] | null>(null);
  return (
    <OneVOneContext.Provider
      value={{ roomId, setRoomId, userId, questions, setQuestions }}
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
