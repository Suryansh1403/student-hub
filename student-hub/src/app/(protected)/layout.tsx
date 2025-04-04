import  AppSidebar  from '@/components/AppSideBar';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
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
    <SidebarProvider>
    <AppSidebar />
    <main>
      <SidebarTrigger />
      {children}
    </main>
  </SidebarProvider>

  )
}

export default layout