import React, { useState } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../contexts/AuthContext';
import { useFirestore } from '../hooks/useFirestore';
import { query, where } from 'firebase/firestore';
import { Grade } from '../types';
import { TableSkeleton } from '../components/Common/LoadingSkeleton';
import { EmptyState } from '../components/Common/EmptyState';

export const Grades: React.FC = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  
  const { data: grades, loading } = useFirestore<Grade>(
    'grades',
    user ? [where('studentId', '==', user.uid)] : []
  );

  const getGradeColor = (grade: number) => {
    if (grade >= 5.5) return 'text-green-600 bg-green-100';
    if (grade >= 4) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  // Group grades by subject
  const gradesBySubject = grades.reduce((acc, grade) => {
    if (!acc[grade.subject]) {
      acc[grade.subject] = [];
    }
    acc[grade.subject].push(grade);
    return acc;
  }, {} as Record<string, Grade[]>);

  // Calculate averages
  const subjectAverages = Object.entries(gradesBySubject).map(([subject, subjectGrades]) => {
    const average = subjectGrades.reduce((sum, g) => sum + g.value, 0) / subjectGrades.length;
    return { subject, average, count: subjectGrades.length };
  });

  const overallAverage = subjectAverages.reduce((sum, s) => sum + s.average, 0) / subjectAverages.length || 0;

  // Filter subjects based on search
  const filteredSubjects = subjectAverages.filter(s =>
    s.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <TableSkeleton />;

  return (
    <div className="p-6">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Grades</h1>
          <p className="mt-1 text-sm text-gray-500">
            Overall Average: {overallAverage.toFixed(2)}
          </p>
        </div>
        <div className="mt-3 sm:mt-0 sm:ml-4">
          <div className="relative rounded-md shadow-sm">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              placeholder="Search subjects..."
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6">
        {filteredSubjects.length > 0 ? (
          <div className="space-y-6">
            {filteredSubjects.map(({ subject, average }) => (
              <div key={subject} className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      {subject}
                    </h3>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getGradeColor(average)}`}>
                      Avg: {average.toFixed(2)}
                    </span>
                  </div>
                </div>
                <div className="border-t border-gray-200">
                  <div className="px-4 py-5 sm:p-6">
                    <div className="flex flex-wrap gap-2">
                      {gradesBySubject[subject].map((grade) => (
                        <div
                          key={grade.id}
                          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getGradeColor(grade.value)}`}
                          title={grade.comment}
                        >
                          {grade.value.toFixed(2)}
                          <span className="ml-1 text-xs text-gray-500">
                            ({new Date(grade.date).toLocaleDateString()})
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            title="No grades yet"
            message="Grades will appear here once they are added by your teachers."
          />
        )}
      </div>
    </div>
  );
};
