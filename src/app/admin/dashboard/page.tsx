'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { getAdminDashboardStats } from '@/lib/api';
import toast from 'react-hot-toast';
import { Users, CheckCircle, BarChart } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

// A small, local component for the stat cards
function StatCard({ title, value, icon: Icon }: { title: string; value: number | string; icon: React.ElementType }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md flex items-center gap-4">
      <div className="bg-blue-100 p-3 rounded-full">
        <Icon className="text-blue-600" size={24} />
      </div>
      <div>
        <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </div>
  );
}

export default function AdminDashboardPage() {
  const { data: session } = useSession();
  const [stats, setStats] = useState({ total: 0, active: 0, graduated: 0 });
  const [isLoading, setIsLoading] = useState(true);

  // Fetches the summary stats from our enhanced API
  const fetchStats = useCallback(async () => {
    if (session?.user?.accessToken) {
      try {
        setIsLoading(true);
        const data = await getAdminDashboardStats(session.user.accessToken);
        setStats(data);
      } catch (error: any) {
        toast.error(error.message || 'Failed to fetch dashboard stats.');
      } finally {
        setIsLoading(false);
      }
    }
  }, [session]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      {/* --- Dashboard Stats (Bonus Feature) --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {isLoading ? (
          // A simple skeleton loader for the cards
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white p-6 rounded-lg shadow-md h-[92px] animate-pulse"></div>
          ))
        ) : (
          <>
            <StatCard title="Total Students" value={stats.total} icon={Users} />
            <StatCard title="Active Students" value={stats.active} icon={CheckCircle} />
            <StatCard title="Graduated" value={stats.graduated} icon={BarChart} />
          </>
        )}
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Student Management</h2>
        <p className="text-gray-600 mb-4">
          View, add, edit, and delete all student records from the management page.
        </p>
        <Link href="/admin/students">
          <Button className="w-auto">Go to Student Management</Button>
        </Link>
      </div>
    </div>
  );
}