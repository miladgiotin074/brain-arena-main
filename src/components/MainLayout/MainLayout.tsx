'use client';

import { PropsWithChildren } from 'react';
import { BottomNavigation } from '@/components/BottomNavigation';

interface MainLayoutProps {
  showBottomNav?: boolean;
}

export function MainLayout({ 
  children, 
  showBottomNav = true 
}: PropsWithChildren<MainLayoutProps>) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-white relative overflow-x-hidden">
      {/* Background pattern */}
      <div className="fixed inset-0 opacity-5 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)]" />
      </div>
      
      <main className={`${showBottomNav ? 'pb-20' : 'pb-2'} pt-2 px-1 relative z-10`}>
        <div className="max-w-md mx-auto">
          {children}
        </div>
      </main>
      
      {/* Bottom Navigation */}
      {showBottomNav && <BottomNavigation />}
    </div>
  );
}