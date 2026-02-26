import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useFirestore } from '../hooks/useFirestore';
import { Absence } from '../types';
import { TableSkeleton } from '../components/Common/LoadingSkeleton';
import toast from 'react-hot-toast';

interface Student {
  id: string;
  name: string;
  class: string;
}

export const TeacherAbsences: React.FC = () => {
  const { user } = useAuth();
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedPeriod, setSelectedPeriod] = useState(1);
  const [attendance, setAttendance] = useState<Record<string, 'present' | 'excused' | 'unexcused'>>({});

  const classes = ['Class 10A', 'Class 10B', 'Class 11A'];
  const periods = [1, 2, 3, 4, 5, 6, 7, 8];

  const students: Student[] = [
    { id: '1', name: 'Ivan Petrov', class: 'Class 10A' },
    { id: '2', name: 'Maria Ivanova', class: 'Class 10A' },
    { id: '3', name: 'Georgi Dimitrov', class: 'Class 10A' },
  ];

  const { add: addAbsence, loading } = useFirestore('absences');

  const handleMarkAttendance = async () => {
    try {
      const absences = Object.entries(attendance)
        .filter(([_, status]) => status !== 'present')
        .map(([studentId, status]) => ({
          studentId,
          studentName: students.find(s => s.id === studentId)?.name,
          class: selectedClass,
          date: selectedDate,
          period: selectedPeriod,
          status,
          teacherId: user?.uid
        }));

      // Save all absences
      for (const absence of absences) {
        await addAbsence(absence);
      }

      toast.success('Attendance marked successfully');
      setAttendance({});
    } catch (error) {
      toast.error('Failed to mark attendance');
    }
  };

  const toggleAttendance = (studentId: string, status: 'present' | 'excused' | 'unexcused') => {
    setAttendance(prev => ({
      ...prev,
      [studentId]: prev[studentId] === status ? 'present' : status
    }));
  };

  if (loading) return <TableSkeleton />;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Mark Absences</h1>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Class</label>
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
          >
            <option value="">Select a class</option>
            {classes.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Date</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Period</label>
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(parseInt(e.target.value))}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
          >
            {periods.map(p => (
              <option key={p} value={p}>Period {p}</option>
            ))}
          </select>
        </div>
      </div>

      {selectedClass && (
        <>
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {students
                .filter(s => s.class === selectedClass)
                .map((student) => (
                  <li key={student.id} className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-medium text-gray-900">
                        {student.name}
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => toggleAttendance(student.id, 'present')}
                          className={`px-3 py-1 rounded-md text-sm font-medium ${
                            attendance[student.id] === 'present' || !attendance[student.id]
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          Present
                        </button>
                        <button
                          onClick={() => toggleAttendance(student.id, 'excused')}
                          className={`px-3 py-1 rounded-md text-sm font-medium ${
                            attendance[student.id] === 'excused'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          Excused
                        </button>
                        <button
                          onClick={() => toggleAttendance(student.id, 'unexcused')}
                          className={`px-3 py-1 rounded-md text-sm font-medium ${
                            attendance[student.id] === 'unexcused'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          Unexcused
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
            </ul>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              onClick={handleMarkAttendance}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark"
            >
              Save Attendance
            </button>
          </div>
        </>
      )}
    </div>
  );
};
