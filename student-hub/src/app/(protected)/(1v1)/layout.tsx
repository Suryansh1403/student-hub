import { OneVOneProvider } from '@/context/1v1Context'
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import React from 'react'
import { redirect } from 'next/navigation';
const layout = async  ({children}:{children:React.ReactNode}) => {

    const session = await getKindeServerSession();
  const user = await session.getUser();
if(!user || !user.id ) redirect("/");

  return (
    <div>

<OneVOneProvider userID={user.id}>
    {children}
</OneVOneProvider>

    </div>
  )
}

export default layout