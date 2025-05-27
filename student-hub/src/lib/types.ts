import { Question, Example } from "@prisma/client";

export type QuestionWithExamples = Question & {
  examples: Example[];
};



export type LeaderboardEntry = {
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