import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useFirestore } from '../hooks/useFirestore';
import { where } from 'firebase/firestore';
import { Grade, Absence, Homework, Announcement } from '../types';
import { CardSkeleton } from '../components/Common/LoadingSkeleton';
import {
  AcademicCapIcon,
  CalendarIcon,
  BookOpenIcon,
  MegaphoneIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';
import { NavLink } from 'react-router-dom';

const StatCard: React.FC<{
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ElementType;
  color: string;
  href: string;
}> = ({ title, value, subtitle, icon: Icon, color, href }) => (
  <NavLink to={href} className="block">
    <div className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow">
      <div className="p-5">
        <div className="flex items-center">
          <div className={`flex-shrink-0 rounded-md p-3 ${color}`}>
            <Icon className="h-6 w-6 text-white" aria-hidden="true" />
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
              <dd className="flex items-baseline">
                <div className="text-2xl font-semibold text-gray-900">{value}</div>
                {subtitle && (
                  <div className="ml-2 flex items-baseline text-sm font-semibold text-gray-500">
                    {subtitle}
                  </div>
                )}
              </dd>
            </dl>
          </div>
        </div>
      </div>
    </div>
  </NavLink>
);

export const Dashboard: React.FC = () => {
  const { user, role } = useAuth();

  const { data: grades, loading: gradesLoading } = useFirestore<Grade>(
    'grades',
    user ? [where('studentId', '==', user.uid)] : []
  );

  const { data: absences, loading: absencesLoading } = useFirestore<Absence>(
    'absences',
    user ? [where('studentId', '==', user.uid)] : []
  );

  const { data: homework, loading: homeworkLoading } = useFirestore<Homework>(
    'homework',
    []
  );

  const { data: announcements, loading: announcementsLoading } = useFirestore<Announcement>(
    'announcements',
    []
  );

  const overallAverage = (() => {
    if (grades.length === 0) return '—';
    const avg = grades.reduce((sum, g) => sum + g.value, 0) / grades.length;
    return avg.toFixed(2);
  })();

  const unexcusedAbsences = absences.filter(a => a.status === 'unexcused').length;

  const now = new Date();
  const upcomingHomework = homework.filter(h => new Date(h.deadline) >= now);

  const recentAnnouncements = [...announcements]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3);

  const isLoading = gradesLoading || absencesLoading || homeworkLoading || announcementsLoading;

  if (isLoading) return <CardSkeleton />;

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">
          Welcome back, {user?.displayName || user?.email?.split('@')[0] || 'User'} 👋
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Here's what's happening today
        </p>
      </div>

      {/* Stats Grid */}
      {role === 'student' ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Overall Average"
            value={overallAverage}
            icon={AcademicCapIcon}
            color="bg-blue-500"
            href="/grades"
          />
          <StatCard
            title="Absences"
            value={absences.length}
            subtitle={`${unexcusedAbsences} unexcused`}
            icon={CalendarIcon}
            color="bg-red-500"
            href="/absences"
          />
          <StatCard
            title="Pending Homework"
            value={upcomingHomework.length}
            icon={BookOpenIcon}
            color="bg-yellow-500"
            href="/homework"
          />
          <StatCard
            title="Announcements"
            value={announcements.length}
            icon={MegaphoneIcon}
            color="bg-green-500"
            href="/announcements"
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard
            title="Active Assignments"
            value={homework.length}
            icon={BookOpenIcon}
            color="bg-yellow-500"
            href="/homework"
          />
          <StatCard
            title="Announcements"
            value={announcements.length}
            icon={MegaphoneIcon}
            color="bg-green-500"
            href="/announcements"
          />
          <StatCard
            title="Class Absences"
            value={absences.length}
            icon={CalendarIcon}
            color="bg-red-500"
            href="/absences"
          />
        </div>
      )}

      {/* Recent Announcements */}
      {recentAnnouncements.length > 0 && (
        <div className="mt-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Announcements</h2>
          <div className="space-y-3">
            {recentAnnouncements.map((announcement) => (
              <div key={announcement.id} className="bg-white shadow rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900">{announcement.title}</h3>
                    <p className="mt-1 text-sm text-gray-500 line-clamp-2">{announcement.content}</p>
                  </div>
                  <span className="ml-4 text-xs text-gray-400 whitespace-nowrap">
                    {new Date(announcement.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="mt-2 text-xs text-gray-400">By {announcement.teacherName}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upcoming Homework (student only) */}
      {role === 'student' && upcomingHomework.length > 0 && (
        <div className="mt-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Upcoming Deadlines</h2>
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {upcomingHomework.slice(0, 5).map((hw) => (
                <li key={hw.id} className="px-4 py-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{hw.title}</p>
                    <p className="text-sm text-gray-500">{hw.subject}</p>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <ClockIcon className="h-4 w-4 mr-1" />
                    {new Date(hw.deadline).toLocaleDateString()}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};
