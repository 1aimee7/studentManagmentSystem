'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

import { Input } from '@/components/ui/Input';
import toast from 'react-hot-toast';
import { registerUser } from '@/lib/api';

export default function RegisterPage() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await registerUser(formData);
      toast.success('Registration successful! Please log in.');
      router.push('/login');
    } catch (error: any) {
      toast.error(error.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center mt-10">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center">Create an Account</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name">Full Name</label>
            <Input id="name" name="name" type="text" onChange={handleChange} required />
          </div>
          <div>
            <label htmlFor="email">Email</label>
            <Input id="email" name="email" type="email" onChange={handleChange} required />
          </div>
          <div>
            <label htmlFor="password">Password</label>
            <Input id="password" name="password" type="password" onChange={handleChange} required />
          </div>
          <Button type="submit" disabled={loading}>
            {loading ? 'Registering...' : 'Register'}
          </Button>
        </form>
      </div>
    </div>
  );
}