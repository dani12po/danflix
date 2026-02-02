'use client';

import { motion } from 'framer-motion';

interface LoadingSkeletonProps {
  type?: 'card' | 'text' | 'avatar' | 'list';
  count?: number;
  className?: string;
}

export default function LoadingSkeleton({ 
  type = 'card', 
  count = 1, 
  className = '' 
}: LoadingSkeletonProps) {
  const renderSkeleton = () => {
    switch (type) {
      case 'card':
        return (
          <div className="space-y-4">
            <div className="skeleton skeleton-card h-48" />
            <div className="space-y-2">
              <div className="skeleton skeleton-text h-4 w-3/4" />
              <div className="skeleton skeleton-text h-3 w-1/2" />
            </div>
          </div>
        );
      
      case 'text':
        return (
          <div className="space-y-2">
            <div className="skeleton skeleton-text h-4 w-full" />
            <div className="skeleton skeleton-text h-4 w-5/6" />
            <div className="skeleton skeleton-text h-4 w-4/6" />
          </div>
        );
      
      case 'avatar':
        return <div className="skeleton skeleton-avatar" />;
      
      case 'list':
        return (
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="skeleton skeleton-avatar" />
              <div className="flex-1 space-y-2">
                <div className="skeleton skeleton-text h-4 w-3/4" />
                <div className="skeleton skeleton-text h-3 w-1/2" />
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="skeleton skeleton-avatar" />
              <div className="flex-1 space-y-2">
                <div className="skeleton skeleton-text h-4 w-2/3" />
                <div className="skeleton skeleton-text h-3 w-1/3" />
              </div>
            </div>
          </div>
        );
      
      default:
        return <div className="skeleton h-8 w-full" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={className}
    >
      {Array.from({ length: count }).map((_, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          {renderSkeleton()}
        </motion.div>
      ))}
    </motion.div>
  );
}

// Film Card Skeleton
export function FilmCardSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="film-card"
        >
          <div className="skeleton skeleton-card h-64" />
          <div className="p-4 space-y-2">
            <div className="skeleton skeleton-text h-4 w-full" />
            <div className="skeleton skeleton-text h-3 w-2/3" />
          </div>
        </motion.div>
      ))}
    </div>
  );
}

// Series Episode Skeleton
export function EpisodeSkeleton({ count = 12 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          className="card"
        >
          <div className="flex gap-4">
            <div className="skeleton skeleton-avatar" />
            <div className="flex-1 space-y-2">
              <div className="skeleton skeleton-text h-4 w-3/4" />
              <div className="skeleton skeleton-text h-3 w-1/2" />
              <div className="skeleton skeleton-text h-3 w-2/3" />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

// Loading Spinner
export function LoadingSpinner({ size = 'medium' }: { size?: 'small' | 'medium' | 'large' }) {
  const sizeClasses = {
    small: 'loading-spinner.small',
    medium: 'loading-spinner',
    large: 'loading-spinner.large'
  };

  return (
    <div className="flex items-center justify-center">
      <div className={`${sizeClasses[size]} animate-spin`} />
    </div>
  );
}
