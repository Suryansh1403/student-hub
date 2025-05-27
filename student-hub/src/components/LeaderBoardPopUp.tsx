import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Trophy } from "lucide-react"; // or use Leaderboard icon
import { LeaderboardEntry } from "@/lib/types";
import { DialogTitle } from "@radix-ui/react-dialog";

export default function LeaderboardPopup({ leaderboardData }: { leaderboardData: LeaderboardEntry[] |[] }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="fixed top-4 right-4 p-2 bg-yellow-400 hover:bg-yellow-500 text-white rounded-full shadow-lg transition">
          <Trophy className="w-5 h-5" />
        </button>
      </DialogTrigger>

      <DialogContent className="max-w-md w-full">
        <DialogTitle>
        🏆 Leaderboard

        </DialogTitle>
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {leaderboardData.length === 0 && <p>No data yet.</p>}
          {leaderboardData.map((entry, index) => (
            <div
              key={entry.userId}
              className="flex items-center justify-between px-4 py-2 bg-gray-100 rounded"
            >
              <div className="flex gap-2 items-center">
                <span className="font-semibold">{index + 1}.</span>
                <span>{ entry.userId }</span>
              </div>
              <div className="text-right">
                <p className="text-sm">Score: {entry.score}</p>
                <p className="text-xs text-gray-600">
                  Attempts: {entry.totalAttempts}, Correct: {entry.totalCorrect}
                </p>
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
