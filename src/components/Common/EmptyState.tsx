import React from 'react';
import { DocumentTextIcon } from '@heroicons/react/24/outline';

interface EmptyStateProps {
  title: string;
  message: string;
  icon?: React.ElementType;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ 
  title, 
  message, 
  icon: Icon = DocumentTextIcon 
}) => {
  return (
    <div className="text-center py-12 bg-white rounded-lg shadow">
      <Icon className="mx-auto h-12 w-12 text-gray-400" />
      <h3 className="mt-2 text-sm font-medium text-gray-900">{title}</h3>
      <p className="mt-1 text-sm text-gray-500">{message}</p>
    </div>
  );
};
