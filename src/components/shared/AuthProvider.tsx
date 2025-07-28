// src/components/shared/AuthProvider.tsx

'use client';

import { Session } from 'next-auth'; // Import the Session type
import { SessionProvider } from 'next-auth/react';

type Props = {
  children?: React.ReactNode;
  session?: Session | null; // <-- Add this optional prop
};

export default function AuthProvider({ children, session }: Props) {
  // Pass the session prop to the SessionProvider.
  // If the prop is provided, SessionProvider will use it as the initial state.
  return <SessionProvider session={session}>{children}</SessionProvider>;
}