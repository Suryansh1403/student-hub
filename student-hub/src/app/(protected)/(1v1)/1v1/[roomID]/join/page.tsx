// app/1v1/[roomId]/page.tsx
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import ClientRoomPage from "@/components/ClientRoomPage"; // 👈 client component

export default async function Page({ params }: { params: { roomID: string } }) {
  const session = await getKindeServerSession();
  const user = await session.getUser();
if( !user) {
    return
}
const roomId = await params.roomID
// if(!user){
//     return
// }

  return <ClientRoomPage roomId={roomId}  join={"yes"} />;
}
