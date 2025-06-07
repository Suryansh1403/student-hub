"use client";
import { useEffect, useState } from "react";

interface ContestTimerProps {
  endTime: number; // in milliseconds (Date.now() + 30 mins)
  onExpire?: () => void;
}

export default function ContestTimer({ endTime, onExpire }: ContestTimerProps) {
  const [timeLeft, setTimeLeft] = useState(endTime - Date.now());

  useEffect(() => {
    if (timeLeft <= 0) {
      onExpire?.();
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft(endTime - Date.now());
    }, 1000);

    return () => clearInterval(interval);
  }, [endTime]);

  if (timeLeft <= 0) {
    return (
      <div className="text-red-600 font-bold text-xl">⏰ Time’s up!</div>
    );
  }

  const minutes = Math.floor(timeLeft / 60000);
  const seconds = Math.floor((timeLeft % 60000) / 1000);

  return (
    <div className="bg-black text-white px-4 py-2 rounded-md font-semibold shadow-md w-fit">
      ⏳ Time Left:{" "}
      <span className="text-red-300">
        {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
      </span>
    </div>
  );
}
