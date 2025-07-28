'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { StudentRecord } from '@/types';
import {
  getAllStudents,
  createStudent,
  updateStudent,
  deleteStudent as apiDeleteStudent,
  changeUserRole,
} from '@/lib/api';
// Corrected Imports:

import Modal from '@/components/ui/Modal';
import { Button } from '@/components/ui/button'; // Correct casing
import toast from 'react-hot-toast';
import { PlusCircle } from 'lucide-react';
import StudentTable from '@/components/admin/StudentTable';
import StudentForm from '../StudentForm';

export default function ManageStudentsPage() {
  const { data: session } = useSession();

  // --- State for data and UI control ---
  const [students, setStudents] = useState<StudentRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingStudent, setEditingStudent] = useState<StudentRecord | null>(null);

  // --- NEW STATE for Pagination & Filtering ---
  const [totalStudents, setTotalStudents] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Graduated' | 'Dropped'>('All');
  const studentsPerPage = 5; // You can adjust this value

  // --- UPDATED Data fetching function ---
  const fetchStudents = useCallback(async () => {
    if (session?.user?.accessToken) {
      try {
        setIsLoading(true);
        const options = { page: currentPage, limit: studentsPerPage, statusFilter };
        
        // THE FIX IS HERE: We now destructure the response object from the API
        const { students: studentData, total: totalData } = await getAllStudents(session.user.accessToken, options);
        
        setStudents(studentData);
        setTotalStudents(totalData);

      } catch (error: any) {
        toast.error(error.message || 'Failed to fetch students.');
      } finally {
        setIsLoading(false);
      }
    }
  }, [session, currentPage, statusFilter]); // Re-fetch when page or filter changes

  // This effect now runs whenever the page or filter is changed
  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  // --- All other handlers (openModal, handleFormSubmit, etc.) remain the same ---
  // ... (copy all the handlers from the previous response here)
  const openAddModal = () => { setEditingStudent(null); setIsModalOpen(true); };
  const openEditModal = (student: StudentRecord) => { setEditingStudent(student); setIsModalOpen(true); };
  const closeModal = () => { setIsModalOpen(false); };
  const handleFormSubmit = async (formData: Omit<StudentRecord, 'id'> | Partial<StudentRecord>) => {
    if (!session?.user?.accessToken) return;
    setIsSubmitting(true);
    try {
      if (editingStudent) {
        await updateStudent(editingStudent.id, formData, session.user.accessToken);
        toast.success('Student updated successfully!');
      } else {
        await createStudent(formData as Omit<StudentRecord, 'id'>, session.user.accessToken);
        toast.success('Student added successfully!');
      }
      closeModal();
      await fetchStudents();
    } catch (error: any) {
      toast.error(error.message || 'An error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleDelete = async (studentId: string) => {
    if (!session?.user?.accessToken) return;
    if (window.confirm('Are you sure?')) {
      try {
        await apiDeleteStudent(studentId, session.user.accessToken);
        toast.success('Student deleted.');
        await fetchStudents(); // Re-fetch to update total count and page
      } catch (error: any) { toast.error(error.message); }
    }
  };
  const handleRoleChange = async (student: StudentRecord) => {
    if (!session?.user?.accessToken) return;
    if (window.confirm(`Promote ${student.name} to Admin?`)) {
      try {
        await changeUserRole(student.id, 'admin', session.user.accessToken);
        toast.success(`${student.name} promoted to Admin.`);
      } catch (error: any) { toast.error(error.message); }
    }
  };
  
  const totalPages = Math.ceil(totalStudents / studentsPerPage);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manage Students ({totalStudents})</h1>
        <Button onClick={openAddModal} className="w-auto flex items-center gap-2">
          <PlusCircle size={18} /> Add New Student
        </Button>
      </div>

      {/* --- NEW Filtering UI --- */}
      <div className="mb-4">
        <label htmlFor="statusFilter" className="mr-2 font-medium">Filter by status:</label>
        <select
          id="statusFilter"
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value as any);
            setCurrentPage(1); // Reset to first page when filter changes
          }}
          className="p-2 border border-gray-300 rounded-md"
        >
          <option value="All">All</option>
          <option value="Active">Active</option>
          <option value="Graduated">Graduated</option>
          <option value="Dropped">Dropped</option>
        </select>
      </div>

      <div className="p-6 bg-white rounded-lg shadow-md">
        {isLoading ? (
          <p className="text-center animate-pulse">Loading student data...</p>
        ) : (
          <StudentTable
            students={students}
            onEdit={openEditModal}
            onDelete={handleDelete}
            onRoleChange={handleRoleChange}
          />
        )}
      </div>

      {/* --- NEW Pagination UI --- */}
      <div className="flex justify-center items-center gap-4 mt-6">
        <Button onClick={() => setCurrentPage(p => p - 1)} disabled={currentPage === 1}>
          Previous
        </Button>
        <span>Page {currentPage} of {totalPages}</span>
        <Button onClick={() => setCurrentPage(p => p + 1)} disabled={currentPage >= totalPages}>
          Next
        </Button>
      </div>

      <Modal isOpen={isModalOpen} onClose={closeModal} title={editingStudent ? 'Edit Student' : 'Add New Student'}>
        <StudentForm initialData={editingStudent} onSubmit={handleFormSubmit} isLoading={isSubmitting} />
      </Modal>
    </div>
  );
}