'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { User, Mail, Shield, Edit3, Camera, Calendar, Clock } from 'lucide-react';
import { getMyProfile, updateMyProfile } from '@/lib/api';
import { UserProfile } from '@/types';
import { Button } from '@/components/ui/button';

import toast from 'react-hot-toast';
import ProfileForm from '@/app/features/profile/profileForm';

// --- Helper functions from your design ---
const getRoleColor = (role: string) => {
  switch (role?.toLowerCase()) {
    case 'admin': return 'bg-red-100 text-red-800 border-red-200';
    case 'student': return 'bg-blue-100 text-blue-800 border-blue-200';
    default: return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const formatDate = (dateString?: string) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
};


export default function ProfilePage() {
  const { data: session, status, update: updateSession } = useSession({
    required: true,
    onUnauthenticated() {
      redirect('/login?callbackUrl=/profile');
    },
  });

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  const fetchProfile = useCallback(async () => {
    if (session?.user?.accessToken) {
      try {
        setIsLoading(true);
        const profileData = await getMyProfile(session.user.accessToken);
        setProfile(profileData);
      } catch (error: any) {
        toast.error(error.message || "Failed to fetch profile data.");
      } finally {
        setIsLoading(false);
      }
    }
  }, [session]);

  useEffect(() => { fetchProfile(); }, [fetchProfile]);

  const handleUpdateProfile = async (formData: Partial<UserProfile>) => {
    if (!session?.user?.accessToken) return;
    setIsLoading(true);
    try {
      const updatedProfile = await updateMyProfile(formData, session.user.accessToken);
      setProfile(updatedProfile);
      if (formData.name && formData.name !== session.user.name) {
        await updateSession({ name: formData.name });
      }
      toast.success('Profile updated successfully!');
      setIsEditing(false);
    } catch (error: any) {
      toast.error(error.message || 'Failed to update profile.');
    } finally {
      setIsLoading(false);
    }
  };

  // Render a loading state while fetching initial data
  if (isLoading || !profile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // --- Main Render Logic ---
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Profile</h1>
          <p className="text-gray-600">Manage your account information and preferences</p>
        </div>

        {isEditing ? (
          // --- EDITING MODE ---
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h2 className="text-xl font-semibold mb-4">Edit Your Information</h2>
            <ProfileForm
              initialData={profile}
              onSubmit={handleUpdateProfile}
              onCancel={() => setIsEditing(false)}
              isLoading={isLoading}
            />
          </div>
        ) : (
          // --- VIEWING MODE (Your Beautiful UI) ---
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Card */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <div className="text-center">
                  <div className="relative inline-block mb-4">
                    <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                      <User className="w-10 h-10 text-white" />
                    </div>
                    <button className="absolute -bottom-1 -right-1 w-8 h-8 bg-blue-600 hover:bg-blue-700 rounded-full flex items-center justify-center text-white shadow-lg">
                      <Camera className="w-4 h-4" />
                    </button>
                  </div>

                  <h2 className="text-xl font-semibold text-gray-900 mb-1">{profile.name}</h2>
                  <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getRoleColor(profile.role)} mb-4`}>
                    <Shield className="w-3 h-3 mr-1" />
                    {profile.role.charAt(0).toUpperCase() + profile.role.slice(1)}
                  </div>

                  <div className="space-y-3 text-sm">
                    <div className="flex items-center justify-center text-gray-600">
                      <Calendar className="w-4 h-4 mr-2" />
                      Joined {formatDate(profile.joinedAt)}
                    </div>
                  </div>

                  <Button onClick={() => setIsEditing(true)} className="mt-6 w-full flex items-center justify-center">
                    <Edit3 className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
                <div className="space-y-4">
                    <p><strong>Full Name:</strong> {profile.name}</p>
                    <p><strong>Email:</strong> {profile.email}</p>
                    <p><strong>Phone:</strong> {profile.phone || 'Not specified'}</p>
                    {profile.role === 'student' && (
                        <>
                            <p><strong>Course:</strong> {profile.course || 'Not specified'}</p>
                            <p><strong>Enrollment Year:</strong> {profile.enrollmentYear || 'Not specified'}</p>
                        </>
                    )}
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900">Account Security</h3>
                 <button className="mt-4 text-blue-600 hover:text-blue-700 text-sm font-medium">Change Password</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}