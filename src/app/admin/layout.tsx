'use client';

import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { useEffect } from 'react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();

  // Use useEffect to handle redirection after the session status is determined.
  useEffect(() => {
    // If the check is complete and the user is NOT a logged-in admin, redirect.
    if (status !== 'loading' && (status === 'unauthenticated' || session?.user?.role !== 'admin')) {
      redirect('/');
    }
  }, [status, session]);

  // While the session is loading or if the user is not yet confirmed as an admin,
  // show a loading/verification screen. This prevents the protected content
  // from ever being rendered for an unauthorized user.
  if (status === 'loading' || !session || session.user.role !== 'admin') {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg text-gray-600 animate-pulse">
          Verifying administrative access...
        </p>
      </div>
    );
  }

  // Only if the user is a confirmed admin, render the children components.
  return <>{children}</>;
}