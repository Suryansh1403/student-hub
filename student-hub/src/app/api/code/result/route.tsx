import { NextRequest, NextResponse } from "next/server";
import {db as prisma } from "@/db";
import { EndReason } from "@prisma/client";
import { ContestResultPayload } from "@/lib/types";





export async function POST(req: NextRequest) {
   const { roomId, winnerId, reason, leaderboard, participants }: ContestResultPayload = await req.json();

    if (!roomId || !reason || !Array.isArray(leaderboard) || !Array.isArray(participants)) {
      return NextResponse.json({ success: false });
    }
    const created = await prisma.contestResult.create({
      data: {
        roomId,
        winnerId: winnerId || null,
        reason,
        participants: {
          connect: participants.map((id) => ({ id })),
        },
        leaderboard: {
          create: leaderboard.map((entry) => ({
            userId: entry.userId,
            score: entry.score,
            questionStats: {
              create: Object.values(entry.questionStats).map((stat) => ({
                questionId: stat.questionId,
                attempts: stat.attempts,
                isCorrect: stat.isCorrect,
              })),
            },
          })),
        },
      },
    });

  return NextResponse.json({ success: true });
}






export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

const roomId = searchParams.get("roomId")

  if ( !roomId) {
    return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
  }

  const result = await prisma.contestResult.findFirst({
    where: { roomId },
  });

  return NextResponse.json({result });
}
