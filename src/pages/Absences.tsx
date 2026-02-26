import React, { useState } from 'react';
import { MagnifyingGlassIcon, CalendarIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../contexts/AuthContext';
import { useFirestore } from '../hooks/useFirestore';
import { query, where } from 'firebase/firestore';
import { Absence } from '../types';
import { TableSkeleton } from '../components/Common/LoadingSkeleton';
import { EmptyState } from '../components/Common/EmptyState';

export const Absences: React.FC = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  
  const { data: absences, loading } = useFirestore<Absence>(
    'absences',
    user ? [where('studentId', '==', user.uid)] : []
  );

  const totalAbsences = absences.length;
  const excusedCount = absences.filter(a => a.status === 'excused').length;
  const unexcusedCount = absences.filter(a => a.status === 'unexcused').length;

  const filteredAbsences = absences.filter(absence =>
    absence.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    absence.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <TableSkeleton />;

  return (
    <div className="p-6">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Absences</h1>
          <div className="mt-2 flex space-x-4">
            <span className="text-sm text-gray-500">Total: {totalAbsences}</span>
            <span className="text-sm text-green-600">Excused: {excusedCount}</span>
            <span className="text-sm text-red-600">Unexcused: {unexcusedCount}</span>
          </div>
        </div>
        <div className="mt-3 sm:mt-0 sm:ml-4">
          <div className="relative rounded-md shadow-sm">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              placeholder="Search absences..."
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6">
        {filteredAbsences.length > 0 ? (
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {filteredAbsences.map((absence) => (
                <li key={absence.id}>
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <CalendarIcon className="h-5 w-5 text-gray-400 mr-2" />
                        <p className="text-sm font-medium text-gray-900">
                          {new Date(absence.date).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="ml-2 flex-shrink-0 flex">
                        <p className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          absence.status === 'excused' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {absence.status}
                        </p>
                      </div>
                    </div>
                    <div className="mt-2 sm:flex sm:justify-between">
                      <div className="sm:flex">
                        <p className="flex items-center text-sm text-gray-500">
                          {absence.subject}
                        </p>
                        <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                          Period {absence.period}
                        </p>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <EmptyState
            title="No absences"
            message="You have no recorded absences. Great attendance!"
            icon={CalendarIcon}
          />
        )}
      </div>
    </div>
  );
};
