import { NextResponse } from "next/server";
import { db as prisma } from "@/db";
import { Difficulty, TestCase } from "@prisma/client";
import { setTestCasesInCache,getTestCasesFromCache } from "@/lib/cache";
// Simple in-memory cache for testCases

export async function GET() {
  try {
    const difficulties = [Difficulty.EASY, Difficulty.MEDIUM, Difficulty.HARD];

    const questionsPromises = difficulties.map(async (difficulty) => {
      const questions = await prisma.question.findMany({
        where: { difficulty },
        take: 5,
      });

      if (questions.length === 0) return null;

      const randomQuestion = questions[Math.floor(Math.random() * questions.length)];

      // Fetch full question including testCases
      const fullQuestion = await prisma.question.findUnique({
        where: { id: randomQuestion.id },
        include: {
          examples: true,
          testCases: true, // for caching only
        },
      });

      if (!fullQuestion) return null;

setTestCasesInCache(fullQuestion.id,fullQuestion.testCases.map(tc => tc))

      const { testCases, ...questionWithoutTestCases } = fullQuestion;

      return questionWithoutTestCases;
    });

    const questions = await Promise.all(questionsPromises);
    const filtered = questions.filter((q) => q !== null);

    return NextResponse.json({ questions: filtered });
  } catch (err) {
    console.error("❌ Error fetching questions:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// Export cache getter so submit API can use it
export function getTestCases(questionId: string):TestCase[] {
  return getTestCasesFromCache(questionId);
}
