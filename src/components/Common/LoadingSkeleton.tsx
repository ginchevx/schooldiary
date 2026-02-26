import React from 'react';

export const LoadingSkeleton: React.FC = () => {
  return (
    <div className="animate-pulse">
      <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
      <div className="space-y-3">
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
      </div>
    </div>
  );
};

export const CardSkeleton: React.FC = () => {
  return (
    <div className="p-6 animate-pulse">
      <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white shadow rounded-lg p-5">
            <div className="flex items-center">
              <div className="h-12 w-12 bg-gray-200 rounded-md"></div>
              <div className="ml-5 flex-1">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-6 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const TableSkeleton: React.FC = () => {
  return (
    <div className="animate-pulse">
      <div className="h-10 bg-gray-200 rounded w-full mb-2"></div>
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="h-16 bg-gray-100 rounded w-full mb-2"></div>
      ))}
    </div>
  );
};
