'use client';
import { StudentRecord } from "@/types";
import { Edit, Trash2, UserCog } from "lucide-react";

interface StudentTableProps {
  students: StudentRecord[];
  onEdit: (student: StudentRecord) => void;
  onDelete: (id: string) => void;
  onRoleChange: (student: StudentRecord) => void;
}

export default function StudentTable({ students, onEdit, onDelete, onRoleChange }: StudentTableProps) {
  if (!students || students.length === 0) {
    return <p className="text-center text-gray-500 py-8">No students found.</p>;
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="min-w-full divide-y-2 divide-gray-200 bg-white text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="whitespace-nowrap px-4 py-3 text-left font-medium text-gray-900">Name</th>
            <th className="whitespace-nowrap px-4 py-3 text-left font-medium text-gray-900">Email</th>
            <th className="whitespace-nowrap px-4 py-3 text-left font-medium text-gray-900">Course</th>
            <th className="whitespace-nowrap px-4 py-3 text-left font-medium text-gray-900">Status</th>
            <th className="px-4 py-3 text-center font-medium text-gray-900">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {students.map((student) => (
            <tr key={student.id} className="hover:bg-gray-50">
              <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">{student.name}</td>
              <td className="whitespace-nowrap px-4 py-2 text-gray-700">{student.email}</td>
              <td className="whitespace-nowrap px-4 py-2 text-gray-700">{student.course}</td>
              <td className="whitespace-nowrap px-4 py-2 text-gray-700">{student.status}</td>
              <td className="whitespace-nowrap px-4 py-2">
                <div className="flex justify-center items-center gap-4">
                  <button onClick={() => onEdit(student)} className="text-blue-600 hover:text-blue-800" title="Edit Student">
                    <Edit size={18} />
                  </button>
                  <button onClick={() => onDelete(student.id)} className="text-red-600 hover:text-red-800" title="Delete Student">
                    <Trash2 size={18} />
                  </button>
                  <button onClick={() => onRoleChange(student)} className="text-purple-600 hover:text-purple-800" title="Promote to Admin">
                    <UserCog size={18} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}