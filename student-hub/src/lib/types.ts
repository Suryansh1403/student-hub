import { Question, Example, EndReason } from "@prisma/client";

export type QuestionWithExamples = Question & {
  examples: Example[];
};





export type QuestionStat = {
  questionId: string;
  attempts: number;
  isCorrect: boolean;
};

export type LeaderboardEntry = {
  userId: string;
  score: number;
  questionStats: {
    [questionId: string]: QuestionStat;
  };
};

export type ContestResultPayload = {
  roomId: string;
  winnerId?: string;
  reason: EndReason;
  leaderboard: LeaderboardEntry[];
  participants: string[]; // userIds
};