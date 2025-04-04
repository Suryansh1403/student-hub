import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'
import { redirect } from 'next/navigation';
import React from 'react'

const layout = async ({children}:{children:React.ReactNode}) => {
    const auth = await getKindeServerSession();
  const isAuthenticated =   await auth.isAuthenticated()
    if(!isAuthenticated) {
redirect('/')
    }
  return (
    <div>{children}</div>
  )
}

export default layout