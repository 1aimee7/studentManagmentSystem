import NextAuth, { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      role: 'admin' | 'student';
      accessToken: string; // Add your custom token here
    } & DefaultSession['user'];
  }

  // The user object you pass to the session callback
  interface User {
    id: string;
    role: 'admin' | 'student';
    accessToken: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role: 'admin' | 'student';
    accessToken: string;
  }
}