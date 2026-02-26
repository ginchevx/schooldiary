import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  HomeIcon,
  AcademicCapIcon,
  CalendarIcon,
  BookOpenIcon,
  ClockIcon,
  MegaphoneIcon,
  EnvelopeIcon,
  UsersIcon,
} from '@heroicons/react/24/outline';

interface SidebarProps {
  role: 'student' | 'teacher';
}

const studentNav = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
  { name: 'Grades', href: '/grades', icon: AcademicCapIcon },
  { name: 'Absences', href: '/absences', icon: CalendarIcon },
  { name: 'Homework', href: '/homework', icon: BookOpenIcon },
  { name: 'Timetable', href: '/timetable', icon: ClockIcon },
  { name: 'Announcements', href: '/announcements', icon: MegaphoneIcon },
  { name: 'Messages', href: '/messages', icon: EnvelopeIcon },
];

const teacherNav = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
  { name: 'Gradebook', href: '/gradebook', icon: AcademicCapIcon },
  { name: 'Absences', href: '/absences', icon: CalendarIcon },
  { name: 'Homework', href: '/homework', icon: BookOpenIcon },
  { name: 'Timetable', href: '/timetable', icon: ClockIcon },
  { name: 'Announcements', href: '/announcements', icon: MegaphoneIcon },
  { name: 'Messages', href: '/messages', icon: EnvelopeIcon },
  { name: 'Class List', href: '/class-list', icon: UsersIcon },
];

export const Sidebar: React.FC<SidebarProps> = ({ role }) => {
  const navigation = role === 'student' ? studentNav : teacherNav;

  return (
    <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
      <div className="flex flex-col flex-grow bg-gray-800">
        <div className="flex items-center h-16 flex-shrink-0 px-4 bg-gray-900">
          <h1 className="text-white font-bold text-xl">SchoolDash</h1>
        </div>
        <div className="flex-1 flex flex-col overflow-y-auto">
          <nav className="flex-1 px-2 py-4 space-y-1">
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                className={({ isActive }) =>
                  `group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                    isActive
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`
                }
              >
                <item.icon
                  className="mr-3 h-6 w-6 flex-shrink-0"
                  aria-hidden="true"
                />
                {item.name}
              </NavLink>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
};
