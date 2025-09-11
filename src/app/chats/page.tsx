'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Page } from '@/components/Page';
import { MainLayout } from '@/components/MainLayout';
import { SkeletonList, SkeletonAvatar } from '@/components/SkeletonLoader';

export default function Chats() {
  const t = useTranslations('chats');
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
   <Page back={false}>
      <MainLayout>
        <div className="p-6">

          {isLoading ? (
            <div className="space-y-4 animate-fade-in">
              {Array.from({ length: 5 }).map((_, index) => (
                <div 
                  key={index} 
                  className="glass rounded-xl p-4 animate-shimmer"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-14 h-14 bg-gray-700 rounded-full animate-pulse" />
                    <div className="flex-1 space-y-3">
                      <div className="h-4 bg-gray-700 rounded animate-pulse" />
                      <div className="h-3 bg-gray-700 rounded w-2/3 animate-pulse" />
                      <div className="flex items-center space-x-2">
                        <div className="h-2 w-2 bg-gray-700 rounded-full animate-pulse" />
                        <div className="h-3 bg-gray-700 rounded w-16 animate-pulse" />
                      </div>
                    </div>
                    <div className="w-6 h-6 bg-gray-700 rounded-full animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 animate-slide-up">
              <div className="glass rounded-2xl p-8 max-w-md mx-auto">
                <div className="text-7xl mb-6 animate-scale-in">💬</div>
                <h2 className="text-heading-2 font-semibold text-white mb-3">
                  {t('noChats')}
                </h2>
                <p className="text-body text-gray-400 mb-6">
                  {t('startConversation')}
                </p>
                
                {/* Action Buttons */}
                <div className="space-y-3">
                  <button className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-body font-medium rounded-xl transition-smooth hover:scale-105 active:scale-95 shadow-glow hover:shadow-strong">
                    <span className="flex items-center justify-center space-x-2">
                      <span>🚀</span>
                      <span>Start Chatting</span>
                    </span>
                  </button>
                  
                  <button className="w-full px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white text-body font-medium rounded-xl transition-smooth hover:scale-105 active:scale-95">
                    <span className="flex items-center justify-center space-x-2">
                      <span>🔍</span>
                      <span>Find Players</span>
                    </span>
                  </button>
                </div>
              </div>
              

            </div>
          )}
          
          {/* Floating Action Button */}
          <div className="fixed bottom-20 right-6 z-50">
            <button className="w-14 h-14 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 active:scale-95 flex items-center justify-center">
              <span className="text-2xl">💬</span>
            </button>
          </div>
        </div>
      </MainLayout>
    </Page>
  );
}