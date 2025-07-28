'use client';

import { useState, useEffect } from 'react';
import { UserProfile } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/Input';

interface ProfileFormProps {
  initialData: UserProfile;
  onSubmit: (formData: Partial<UserProfile>) => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
}

export default function ProfileForm({ initialData, onSubmit, onCancel, isLoading }: ProfileFormProps) {
  // The form's state is pre-filled with the student's current data
  const [formData, setFormData] = useState({
    name: initialData.name || '',
    phone: initialData.phone || '',
    course: initialData.course || '',
    enrollmentYear: initialData.enrollmentYear || new Date().getFullYear(),
  });

  // Keep form in sync if the initial data were to ever change
  useEffect(() => {
    setFormData({
      name: initialData.name || '',
      phone: initialData.phone || '',
      course: initialData.course || '',
      enrollmentYear: initialData.enrollmentYear || new Date().getFullYear(),
    });
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'enrollmentYear' ? parseInt(value) || 0 : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // This calls the `handleUpdateProfile` function on the parent page
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
        <Input id="name" name="name" type="text" value={formData.name} onChange={handleChange} required />
      </div>
      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number</label>
        <Input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleChange} />
      </div>

      {/* Student-specific fields */}
      <hr />
      <div>
        <label htmlFor="course" className="block text-sm font-medium text-gray-700">Course of Study</label>
        <Input id="course" name="course" type="text" value={formData.course} onChange={handleChange} />
      </div>
      <div>
        <label htmlFor="enrollmentYear" className="block text-sm font-medium text-gray-700">Enrollment Year</label>
        <Input id="enrollmentYear" name="enrollmentYear" type="number" value={formData.enrollmentYear} onChange={handleChange} />
      </div>

      <div className="flex items-center gap-4 pt-4">
        <Button type="submit" disabled={isLoading} className="flex-1">
          {isLoading ? 'Saving...' : 'Save Changes'}
        </Button>
        <Button type="button" onClick={onCancel} disabled={isLoading} className="flex-1 bg-gray-600 hover:bg-gray-700">
          Cancel
        </Button>
      </div>
    </form>
  );
}