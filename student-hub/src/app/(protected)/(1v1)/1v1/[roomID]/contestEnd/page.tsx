import { ContestResultPayload } from "@/lib/types";
import { EndReason } from "@prisma/client";
import axios from "axios";



export default async  function ContestEndPage({ params }: { params: { roomID: string } }) {
  const roomId = params.roomID
 const contestResult :ContestResultPayload = await axios.get(`/api/code/result?roomId=${roomId}`).then(res=>{
  return res.data.result
 }) ;
  if (!contestResult) return <div>Waiting for contest result...</div>;


  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-2">🏁 Contest Ended</h1>
      <p className="mb-2">Reason: {contestResult.reason}</p>
      {contestResult.winnerId && (
        <p className="mb-4">Winner: {contestResult.winnerId}</p>
      )}

      <h2 className="text-xl font-semibold mb-2">Leaderboard</h2>
      <ul className="space-y-1">
        {contestResult.leaderboard.map((entry, i) => (
          <li key={i} className="border p-2 rounded">
            {entry.userId} - {entry.score} pts
          </li>
        ))}
      </ul>
    </div>
  );
}
