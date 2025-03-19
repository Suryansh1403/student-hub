import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { getKindeServerSession, LoginLink } from '@kinde-oss/kinde-auth-nextjs/server';
import { LogoutLink } from '@kinde-oss/kinde-auth-nextjs/server';
export default async function Navbar() {
  const auth = await getKindeServerSession()
  const isAuthenticated = await auth.isAuthenticated()
  return (
    <nav className="bg-blue-600 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-white text-2xl font-bold">
          Student Hub
        </Link>
        {
isAuthenticated &&
        
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
!isAuthenticated &&  
 <div className="space-x-4">
{/* <Link href="/notes"> */}
 <LoginLink>Sign in</LoginLink>
{/* </Link> */}
{/* <Link href="/forum"> */}
<LoginLink>Sign in</LoginLink>
{/* </Link> */}

</div>
}
      </div>
    </nav>
  );
}