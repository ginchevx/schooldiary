import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useFirestore } from '../hooks/useFirestore';
import { query, where } from 'firebase/firestore';
import { Grade } from '../types';
import { TableSkeleton } from '../components/Common/LoadingSkeleton';
import toast from 'react-hot-toast';

interface Student {
  id: string;
  name: string;
  class: string;
}

export const TeacherGradebook: React.FC = () => {
  const { user } = useAuth();
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [gradeValue, setGradeValue] = useState('');
  const [gradeComment, setGradeComment] = useState('');

  // Mock data - replace with Firestore queries
  const classes = ['Class 10A', 'Class 10B', 'Class 11A'];
  const subjects = ['Mathematics', 'Physics', 'Chemistry', 'Literature'];
  
  const students: Student[] = [
    { id: '1', name: 'Ivan Petrov', class: 'Class 10A' },
    { id: '2', name: 'Maria Ivanova', class: 'Class 10A' },
    { id: '3', name: 'Georgi Dimitrov', class: 'Class 10A' },
  ];

  const { data: grades, loading } = useFirestore<Grade>(
    'grades',
    selectedClass && selectedSubject ? [
      where('class', '==', selectedClass),
      where('subject', '==', selectedSubject)
    ] : []
  );

  const { add: addGrade, update: updateGrade } = useFirestore('grades');

  const handleSaveGrade = async () => {
    if (!selectedStudent || !gradeValue) {
      toast.error('Please select a student and enter a grade');
      return;
    }

    const grade = parseFloat(gradeValue);
    if (grade < 2 || grade > 6) {
      toast.error('Grade must be between 2 and 6');
      return;
    }

    try {
      await addGrade({
        studentId: selectedStudent.id,
        studentName: selectedStudent.name,
        class: selectedClass,
        subject: selectedSubject,
        value: grade,
        comment: gradeComment,
        date: new Date().toISOString(),
        teacherId: user?.uid
      });

      toast.success('Grade saved successfully');
      setSelectedStudent(null);
      setGradeValue('');
      setGradeComment('');
    } catch (error) {
      toast.error('Failed to save grade');
    }
  };

  const getStudentAverage = (studentId: string) => {
    const studentGrades = grades.filter(g => g.studentId === studentId);
    if (studentGrades.length === 0) return null;
    const avg = studentGrades.reduce((sum, g) => sum + g.value, 0) / studentGrades.length;
    return avg.toFixed(2);
  };

  if (loading) return <TableSkeleton />;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Gradebook</h1>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 mb-6">
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
          <label className="block text-sm font-medium text-gray-700">Subject</label>
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
            disabled={!selectedClass}
          >
            <option value="">Select a subject</option>
            {subjects.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      {selectedClass && selectedSubject && (
        <>
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Student
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Recent Grades
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Average
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {students.map((student) => {
                  const studentGrades = grades.filter(g => g.studentId === student.id);
                  const average = getStudentAverage(student.id);

                  return (
                    <tr key={student.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {student.name}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {studentGrades.slice(0, 3).map((grade) => (
                            <span
                              key={grade.id}
                              className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                                grade.value >= 5.5 ? 'bg-green-100 text-green-800' :
                                grade.value >= 4 ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'
                              }`}
                            >
                              {grade.value}
                            </span>
                          ))}
                          {studentGrades.length > 3 && (
                            <span className="text-xs text-gray-500">
                              +{studentGrades.length - 3} more
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {average && (
                          <span className={`text-sm font-medium ${
                            parseFloat(average) >= 5.5 ? 'text-green-600' :
                            parseFloat(average) >= 4 ? 'text-yellow-600' :
                            'text-red-600'
                          }`}>
                            {average}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button
                          onClick={() => setSelectedStudent(student)}
                          className="text-primary hover:text-primary-dark"
                        >
                          Add Grade
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="mt-6 bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Class Average: {
                  (grades.reduce((sum, g) => sum + g.value, 0) / grades.length || 0).toFixed(2)
                }
              </h3>
            </div>
          </div>
        </>
      )}

      {/* Grade Entry Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Enter Grade for {selectedStudent.name}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Grade (2-6)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="2"
                  max="6"
                  value={gradeValue}
                  onChange={(e) => setGradeValue(e.target.value)}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Comment (optional)
                </label>
                <textarea
                  rows={3}
                  value={gradeComment}
                  onChange={(e) => setGradeComment(e.target.value)}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
                  placeholder="Add a comment..."
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => {
                  setSelectedStudent(null);
                  setGradeValue('');
                  setGradeComment('');
                }}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveGrade}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark"
              >
                Save Grade
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
