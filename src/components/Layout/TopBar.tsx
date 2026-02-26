import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRightOnRectangleIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

export const TopBar: React.FC = () => {
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
      toast.success('Logged out successfully');
    } catch {
      toast.error('Failed to log out');
    }
  };

  return (
    <div className="sticky top-0 z-10 flex-shrink-0 flex h-16 bg-white shadow">
      <div className="flex-1 px-4 flex justify-between items-center">
        {/* Left: Page title area (mobile branding) */}
        <div className="flex items-center md:hidden">
          <span className="text-gray-800 font-bold text-lg">SchoolDash</span>
        </div>
        <div className="hidden md:block" />

        {/* Right: User info + logout */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <UserCircleIcon className="h-8 w-8 text-gray-400" />
            <div className="hidden sm:block">
              <p className="text-sm font-medium text-gray-900">
                {user?.displayName || user?.email?.split('@')[0] || 'User'}
              </p>
              <p className="text-xs text-gray-500 capitalize">{role}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
            title="Sign out"
          >
            <ArrowRightOnRectangleIcon className="h-5 w-5" />
            <span className="hidden sm:inline">Sign out</span>
          </button>
        </div>
      </div>
    </div>
  );
};
