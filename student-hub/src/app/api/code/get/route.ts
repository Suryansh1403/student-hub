import { NextRequest, NextResponse } from "next/server";
import { db as prisma  } from "@/db";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  const questionId = searchParams.get("questionId");
const roomId = searchParams.get("roomId")
console.log()
  if (!userId || !questionId || !roomId) {
    return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
  }

  const record = await prisma.codeSubmission.findFirst({
    where: { userId, questionId,roomId },
  });

  return NextResponse.json({ code: record?.code || null });
}
