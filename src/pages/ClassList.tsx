import React, { useState } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useFirestore } from '../hooks/useFirestore';
import { TableSkeleton } from '../components/Common/LoadingSkeleton';

interface Student {
  id: string;
  name: string;
  email: string;
  class: string;
  averageGrade?: number;
  absenceCount?: number;
}

export const ClassList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState('');

  const classes = ['Class 10A', 'Class 10B', 'Class 11A'];
  
  // Mock data - replace with Firestore queries
  const [students, setStudents] = useState<Student[]>([
    { id: '1', name: 'Ivan Petrov', email: 'ivan@school.com', class: 'Class 10A', averageGrade: 5.6, absenceCount: 2 },
    { id: '2', name: 'Maria Ivanova', email: 'maria@school.com', class: 'Class 10A', averageGrade: 4.8, absenceCount: 1 },
    { id: '3', name: 'Georgi Dimitrov', email: 'georgi@school.com', class: 'Class 10A', averageGrade: 3.9, absenceCount: 4 },
  ]);

  const filteredStudents = students.filter(s => 
    (selectedClass ? s.class === selectedClass : true) &&
    (s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
     s.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getGradeColor = (grade?: number) => {
    if (!grade) return 'text-gray-500';
    if (grade >= 5.5) return 'text-green-600';
    if (grade >= 4) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="p-6">
      <div className="sm:flex sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Class List</h1>
        <div className="mt-3 sm:mt-0 sm:ml-4 flex space-x-3">
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
          >
            <option value="">All Classes</option>
            {classes.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              placeholder="Search students..."
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 bg-white shadow overflow-hidden sm:rounded-md">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Student
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Class
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Average Grade
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Absences
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredStudents.map((student) => (
              <tr key={student.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {student.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {student.email}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{student.class}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`text-sm font-medium ${getGradeColor(student.averageGrade)}`}>
                    {student.averageGrade?.toFixed(2) || 'N/A'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`text-sm font-medium ${
                    student.absenceCount && student.absenceCount > 3 
                      ? 'text-red-600' 
                      : 'text-gray-900'
                  }`}>
                    {student.absenceCount || 0}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredStudents.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No students found</p>
          </div>
        )}
      </div>
    </div>
  );
};
