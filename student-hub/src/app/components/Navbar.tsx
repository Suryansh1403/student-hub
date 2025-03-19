import Link from 'next/link';
import { Button } from './ui/button';

export default function Navbar() {
  return (
    <nav className="bg-blue-600 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-white text-2xl font-bold">
          Student Hub
        </Link>
        <div className="space-x-4">
          <Link href="/notes">
            <Button variant="ghost" className="text-white hover:bg-blue-700">
              Notes
            </Button>
          </Link>
          <Link href="/forum">
            <Button variant="ghost" className="text-white hover:bg-blue-700">
              Forum
            </Button>
          </Link>
          <Link href="/profile">
            <Button variant="ghost" className="text-white hover:bg-blue-700">
              Profile
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}