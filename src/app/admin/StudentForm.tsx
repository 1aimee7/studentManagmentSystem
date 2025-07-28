'use client';

import { useState, useEffect } from 'react';
import { StudentRecord } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/Input';

interface StudentFormProps {
  initialData?: StudentRecord | null; // Null for Add, has data for Edit
  onSubmit: (formData: Omit<StudentRecord, 'id'> | Partial<StudentRecord>) => Promise<void>;
  isLoading: boolean;
}

export default function StudentForm({ initialData, onSubmit, isLoading }: StudentFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    course: '',
    enrollmentYear: new Date().getFullYear(),
    status: 'Active' as StudentRecord['status'],
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        email: initialData.email,
        course: initialData.course,
        enrollmentYear: initialData.enrollmentYear,
        status: initialData.status,
      });
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'enrollmentYear' ? parseInt(value) || 0 : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name">Full Name</label>
        <Input id="name" name="name" type="text" value={formData.name} onChange={handleChange} required />
      </div>
      <div>
        <label htmlFor="email">Email</label>
        <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required />
      </div>
      <div>
        <label htmlFor="course">Course</label>
        <Input id="course" name="course" type="text" value={formData.course} onChange={handleChange} required />
      </div>
      <div>
        <label htmlFor="enrollmentYear">Enrollment Year</label>
        <Input id="enrollmentYear" name="enrollmentYear" type="number" value={formData.enrollmentYear} onChange={handleChange} required />
      </div>
      <div>
        <label htmlFor="status">Status</label>
        <select
          id="status"
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        >
          <option>Active</option>
          <option>Graduated</option>
          <option>Dropped</option>
        </select>
      </div>
      <div className="pt-2">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Saving...' : (initialData ? 'Update Student' : 'Add Student')}
        </Button>
      </div>
    </form>
  );
}