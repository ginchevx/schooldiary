import React from 'react';
import { MegaphoneIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../contexts/AuthContext';
import { useFirestore } from '../hooks/useFirestore';
import { query, orderBy } from 'firebase/firestore';
import { Announcement } from '../types';
import { TableSkeleton } from '../components/Common/LoadingSkeleton';
import { EmptyState } from '../components/Common/EmptyState';

export const Announcements: React.FC = () => {
  const { user } = useAuth();
  
  const { data: announcements, loading } = useFirestore<Announcement>(
    'announcements',
    [orderBy('createdAt', 'desc')]
  );

  if (loading) return <TableSkeleton />;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Announcements</h1>

      <div className="space-y-4">
        {announcements.length > 0 ? (
          announcements.map((announcement) => (
            <div
              key={announcement.id}
              className="bg-white shadow overflow-hidden sm:rounded-lg"
            >
              <div className="px-4 py-5 sm:px-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    {announcement.title}
                  </h3>
                  <span className="text-sm text-gray-500">
                    {new Date(announcement.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  By {announcement.teacherName}
                  {announcement.targetClass && ` • For ${announcement.targetClass}`}
                </p>
              </div>
              <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                <p className="text-sm text-gray-700 whitespace-pre-wrap">
                  {announcement.content}
                </p>
              </div>
            </div>
          ))
        ) : (
          <EmptyState
            title="No announcements"
            message="There are no announcements at this time."
            icon={MegaphoneIcon}
          />
        )}
      </div>
    </div>
  );
};
