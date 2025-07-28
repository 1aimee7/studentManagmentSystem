'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { LogOut, User, LayoutDashboard } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Navbar() {
  const { data: session, status } = useSession();

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-6 py-3 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-blue-600">
          SMS
        </Link>
        <div className="flex items-center space-x-4">
          {status === 'loading' ? (
            <div className="text-gray-500">Loading...</div>
          ) : session ? (
            <>
              {session.user.role === 'admin' && (
                <Link
                  href="/admin/dashboard"
                  className="flex items-center gap-2 hover:text-blue-500"
                >
                  <LayoutDashboard size={20} /> Admin
                </Link>
              )}
              <Link href="/profile" className="flex items-center gap-2 hover:text-blue-500">
                <User size={20} /> Profile
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="flex items-center gap-2 text-red-500 hover:text-red-700"
              >
                <LogOut size={20} /> Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="hover:text-yellow-500">
                <Button className="w-auto px-4 py-1.5">Login</Button>
              </Link>
              <Link href="/register">
                <Button className="w-auto px-4 py-1.5">Register</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}