import { useEffect, useState } from "react";
 // wherever you initialize your socket
import LeaderboardPopup from "./LeaderBoardPopUp";
import { useOneVOne } from "@/context/1v1Context";
import { LeaderboardEntry } from "@/lib/types";
// import LeaderboardPopup from "./LeaderboardPopup";

export default function LeaderboardContainer() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
const {socket} = useOneVOne()
  useEffect(() => {
    const handleUpdate = ({leaderboard}: {leaderboard:LeaderboardEntry[]}) => {
      setLeaderboard(leaderboard);
    };

    socket.on("leaderboard-update", handleUpdate);

    // Clean up on unmount
    return () => {
      socket.off("leaderboard-update", handleUpdate);
    };
  }, []);

  return <LeaderboardPopup leaderboardData={leaderboard} />;
}
