import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import AuthProvider from '@/components/shared/AuthProvider';
import Navbar from '@/components/shared/Navbar';
import { Toaster } from 'react-hot-toast';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Student Management System',
  description: 'Internship Assessment Project',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-50 text-gray-900`}>
        <AuthProvider>
          <Toaster position="top-right" />
          <Navbar />
          <main className="container mx-auto p-4 md:p-6">
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}