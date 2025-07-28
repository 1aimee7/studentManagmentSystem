'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

import { Input } from '@/components/ui/Input';
import toast from 'react-hot-toast';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const result = await signIn('credentials', {
      redirect: false,
      email,
      password,
    });
    
    setLoading(false);

    if (result?.error) {
      toast.error(result.error);
    } else if (result?.ok) {
      toast.success('Logged in successfully!');
      router.push('/profile');
      router.refresh();
    }
  };

  return (
    <div className="flex justify-center items-center mt-10">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center">Login to your Account</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email">Email</label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div>
            <label htmlFor="password">Password</label>
            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <Button type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </Button>
        </form>
        <p className="text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <Link href="/register" className="font-medium text-blue-600 hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}