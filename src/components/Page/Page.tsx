'use client';

import { PropsWithChildren } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { hapticFeedback } from '@telegram-apps/sdk-react';
import { MainLayout } from '../MainLayout/MainLayout';

interface PageProps {
  back?: boolean;
}

export function Page({ 
  children, 
  back = true 
}: PropsWithChildren<PageProps>) {
  const router = useRouter();
  const t = useTranslations('common');

  const handleBack = () => {
    console.log('Navigating back...');
    
    // Add haptic feedback for back navigation
    if (hapticFeedback.impactOccurred.isAvailable()) {
      hapticFeedback.impactOccurred('light');
    }
    
    router.back();
  };

  return (
    <MainLayout showBottomNav={!back}>
      <div className="min-h-screen flex flex-col">
        {back && (
          <header className="flex items-center p-2 mb-2 animate-slide-down">
            <button
              onClick={handleBack}
              className="flex items-center text-blue-400 hover:text-blue-300 transition-smooth hover:scale-105 active:scale-95 glass px-3 py-2 rounded-lg"
            >
              <span className="text-lg mr-2">←</span>
              <span className="text-body-small font-medium">{t('back')}</span>
            </button>
          </header>
        )}
        <div className="flex-1 px-2 pb-4">
          <div className="animate-fade-in">
            {children}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}