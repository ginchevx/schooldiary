import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  HomeIcon,
  AcademicCapIcon,
  CalendarIcon,
  BookOpenIcon,
  EnvelopeIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '../../contexts/AuthContext';

const studentNav = [
  { name: 'Home', href: '/dashboard', icon: HomeIcon },
  { name: 'Grades', href: '/grades', icon: AcademicCapIcon },
  { name: 'Absences', href: '/absences', icon: CalendarIcon },
  { name: 'Homework', href: '/homework', icon: BookOpenIcon },
  { name: 'Messages', href: '/messages', icon: EnvelopeIcon },
];

const teacherNav = [
  { name: 'Home', href: '/dashboard', icon: HomeIcon },
  { name: 'Gradebook', href: '/gradebook', icon: AcademicCapIcon },
  { name: 'Absences', href: '/absences', icon: CalendarIcon },
  { name: 'Homework', href: '/homework', icon: BookOpenIcon },
  { name: 'Messages', href: '/messages', icon: EnvelopeIcon },
];

export const MobileNav: React.FC = () => {
  const { role } = useAuth();
  const navigation = role === 'teacher' ? teacherNav : studentNav;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-10">
      <div className="flex justify-around">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              `flex flex-col items-center py-2 px-3 text-xs font-medium ${
                isActive ? 'text-gray-900' : 'text-gray-500 hover:text-gray-700'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <item.icon
                  className={`h-6 w-6 ${isActive ? 'text-gray-900' : 'text-gray-400'}`}
                />
                <span className="mt-1">{item.name}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
};
