import { NextRequest, NextResponse } from "next/server";
import {db as prisma } from "@/db";

export async function POST(req: NextRequest) {
  const { userId, questionId, code,roomId } = await req.json();

  if (!userId || !questionId) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const existing = await prisma.codeSubmission.findFirst({
    where: { userId, questionId },
  });

  if (existing) {
    await prisma.codeSubmission.update({
      where: { id: existing.id },
      data: { code },
    });
  } else {
    await prisma.codeSubmission.create({
      data: { userId, questionId, code,language:"java",roomId },
    });
  }

  return NextResponse.json({ success: true });
}
