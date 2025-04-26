import React from 'react';

interface FigmaScreensSkeletonProps {
  count?: number;
}

const FigmaScreensSkeleton = ({ count = 8 }: FigmaScreensSkeletonProps) => {
  return (
    <div className="flex-1 p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {Array.from({ length: count }).map((_, index) => (
          <div 
            key={index} 
            className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
          >
            {/* Skeleton thumbnail */}
            <div className="relative aspect-video bg-gray-200 animate-pulse" />
            
            {/* Skeleton content */}
            <div className="p-3">
              {/* Title skeleton */}
              <div className="h-5 bg-gray-200 rounded w-3/4 mb-3 animate-pulse" />
              
              {/* Footer skeleton */}
              <div className="flex justify-between items-center">
                <div className="h-5 bg-gray-200 rounded w-1/3 animate-pulse" />
                <div className="h-5 bg-gray-200 rounded w-1/4 animate-pulse" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FigmaScreensSkeleton; 