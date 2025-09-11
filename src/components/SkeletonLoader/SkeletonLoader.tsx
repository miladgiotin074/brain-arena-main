'use client';

interface SkeletonLoaderProps {
  className?: string;
  width?: string;
  height?: string;
  rounded?: boolean;
}

export function SkeletonLoader({ 
  className = '', 
  width = 'w-full', 
  height = 'h-4', 
  rounded = true 
}: SkeletonLoaderProps) {
  return (
    <div 
      className={`animate-pulse bg-gray-700 ${width} ${height} ${
        rounded ? 'rounded' : ''
      } ${className}`}
    />
  );
}

// Predefined skeleton components for common use cases
export function SkeletonCard() {
  return (
    <div className="bg-gray-800 rounded-lg p-4 space-y-3">
      <SkeletonLoader height="h-6" width="w-3/4" />
      <SkeletonLoader height="h-4" width="w-full" />
      <SkeletonLoader height="h-4" width="w-2/3" />
    </div>
  );
}

export function SkeletonList({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, index) => (
        <SkeletonCard key={index} />
      ))}
    </div>
  );
}

export function SkeletonAvatar({ size = 'w-10 h-10' }: { size?: string }) {
  return (
    <SkeletonLoader 
      className="rounded-full" 
      width={size.split(' ')[0]} 
      height={size.split(' ')[1]} 
      rounded={false}
    />
  );
}