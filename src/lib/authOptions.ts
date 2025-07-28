import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { loginUser } from './api';
import { AuthResponse } from '@/types'; // <-- Import the AuthResponse type

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      /**
       * This function is called when a user tries to sign in with credentials.
       * It must verify the credentials and return a user object or throw an error.
       */
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Please enter both email and password.');
        }

        try {
          // Call our API function to log the user in with the backend.
          const authResponse: AuthResponse = await loginUser(
            credentials.email,
            credentials.password
          );
          
          // If the login is successful, our API returns an object with `user` and `token`.
          if (authResponse && authResponse.token) {
            // The `authorize` function must return a user object that will be
            // passed to the `jwt` callback. We combine the user data and the token.
            return {
              ...authResponse.user, // id, name, email, role
              accessToken: authResponse.token,
            };
          }
          
          // If login fails but doesn't throw, return null.
          return null;
        } catch (error: any) {
          // Re-throw the error from the API call. NextAuth will catch this
          // and display the message on the login form.
          throw new Error(error.message || 'An unknown authentication error occurred.');
        }
      }
    })
  ],
  /**
   * Callbacks are used to control what happens at different stages of the auth process.
   */
  callbacks: {
    /**
     * The `jwt` callback is called whenever a JSON Web Token is created or updated.
     * The `user` parameter is only available on the initial sign-in.
     */
    async jwt({ token, user }) {
      // On sign-in, persist the user's data (id, role, token) to the JWT.
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.accessToken = user.accessToken;
      }
      return token;
    },
    /**
     * The `session` callback is called whenever a session is accessed.
     * It uses the data from the JWT (`token`) to build the client-side session object.
     */
    async session({ session, token }) {
      // Make the custom properties from the JWT available on the session object.
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.accessToken = token.accessToken;
      }
      return session;
    }
  },
  pages: {
    // Specify custom pages for sign-in and error handling.
    signIn: '/login',
    error: '/login', // Redirect users to the login page on error (e.g., invalid credentials).
  },
  session: {
    // Use JSON Web Tokens for session management.
    strategy: 'jwt',
  },
  // The secret used to sign and encrypt the JWT. Loaded from .env.local.
  secret: process.env.NEXTAUTH_SECRET,
};