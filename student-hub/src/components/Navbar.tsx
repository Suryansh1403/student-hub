import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { getKindeServerSession, LoginLink } from '@kinde-oss/kinde-auth-nextjs/server';
import { LogoutLink } from '@kinde-oss/kinde-auth-nextjs/server';
export default async function Navbar() {
  const {isAuthenticated,getUser} = await getKindeServerSession()
  const isAuth = await isAuthenticated()
  
  return (
    <nav className="bg-blue-600 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-white text-2xl font-bold">
          Student Hub
        </Link>
        {
isAuth &&
        
        <div className="space-x-4">
      
          {/* <Link href="/forum"> */}
            <Button variant="ghost" className="text-white hover:bg-blue-700">
              <LogoutLink>

                sign out
                </LogoutLink>
            </Button>
          {/* </Link> */}
          <Link href="/profile">
            <Button variant="ghost" className="text-white hover:bg-blue-700">
              Profile
            </Button>
          </Link>
      
        </div>
}
{
!isAuth &&  
 <div className="space-x-4">

 <LoginLink>Sign in</LoginLink>

</div>
}
      </div>
    </nav>
  );
}