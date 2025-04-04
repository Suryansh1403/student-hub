import { db } from '@/db';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { redirect } from 'next/navigation';

const Page = async () => {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  // Redirect if user is not authenticated
  if (!user || !user.id) {
    redirect('/');
  }

  // Fetch user from the database
  const dbUser = await db.user.findFirst({
    where: {
      id: user.id,
    },
  });

  // Redirect if user is not found in the database
  if (!dbUser || !dbUser.id) {
    redirect('/auth-callback');
  }

  // Render the component
  return (
 <div></div>
  );
};

export default Page;