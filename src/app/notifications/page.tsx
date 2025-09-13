'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Page } from '@/components/Page';
import { MainLayout } from '@/components/MainLayout';
import { SkeletonList } from '@/components/SkeletonLoader';

export default function Notifications() {
  const t = useTranslations('notifications');
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Page back={false}>
      <MainLayout>
        <div className="p-3">

          {isLoading ? (
            <div className="space-y-4 animate-fade-in">
              {Array.from({ length: 4 }).map((_, index) => (
                <div 
                  key={index} 
                  className="glass rounded-xl p-5 animate-shimmer"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gray-700 rounded-xl animate-pulse" />
                    <div className="flex-1 space-y-3">
                      <div className="h-4 bg-gray-700 rounded animate-pulse" />
                      <div className="h-3 bg-gray-700 rounded w-3/4 animate-pulse" />
                      <div className="h-3 bg-gray-700 rounded w-1/2 animate-pulse" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 animate-slide-up">
              <div className="glass rounded-2xl p-8 max-w-md mx-auto">
                <div className="text-7xl mb-6 animate-scale-in">🔔</div>
                <h2 className="text-heading-2 font-semibold text-white mb-3">
                  {t('noNotifications')}
                </h2>
                <p className="text-body text-gray-400 mb-6">
                  You&apos;re all caught up! New notifications will appear here when you have updates.
                </p>
                
                {/* Action Suggestions */}
                <div className="space-y-3">
                  <button className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white text-body font-medium rounded-xl transition-smooth hover:scale-105 active:scale-95 shadow-glow">
                    <span className="flex items-center justify-center space-x-2">
                      <span>🎯</span>
                      <span>Join a Quiz</span>
                    </span>
                  </button>
                  
                  <button className="w-full px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white text-body font-medium rounded-xl transition-smooth hover:scale-105 active:scale-95">
                    <span className="flex items-center justify-center space-x-2">
                      <span>⚙️</span>
                      <span>Notification Settings</span>
                    </span>
                  </button>
                </div>
              </div>
              
            </div>
          )}
        </div>
      </MainLayout>
    </Page>
  );
}