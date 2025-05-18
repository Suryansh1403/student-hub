import { Question, Example } from "@prisma/client";

export type QuestionWithExamples = Question & {
  examples: Example[];
};



