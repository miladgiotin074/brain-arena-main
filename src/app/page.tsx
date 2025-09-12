'use client';

import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { hapticFeedback } from '@telegram-apps/sdk-react';
import { Page } from '@/components/Page';
import { MainLayout } from '@/components/MainLayout';

export default function Home() {
  const router = useRouter();
  const t = useTranslations('home');

  const handleStartQuiz = useCallback(() => {
    console.log('Starting quiz...');
    
    // Add haptic feedback for navigation
    if (hapticFeedback.impactOccurred.isAvailable()) {
      hapticFeedback.impactOccurred('light');
    }
    
    router.push('/quiz');
  }, [router]);

  const handleNavigateToSecondPage = useCallback(() => {
    console.log('Navigating to second page...');
    
    // Add haptic feedback for navigation
    if (hapticFeedback.impactOccurred.isAvailable()) {
      hapticFeedback.impactOccurred('light');
    }
    
    router.push('/second-page');
  }, [router]);

  return (
    <Page back={false}>
      <MainLayout>
        <div className="min-h-screen p-6">
          {/* Header Section */}
          <div className="text-center mb-8 pt-8">
            <div className="text-6xl mb-4">🧠</div>
            <h1 className="text-display text-white mb-2">
              {t('welcome')}
            </h1>
            <p className="text-body-large text-gray-300 max-w-md mx-auto">
              {t('subtitle')}
            </p>
          </div>

          {/* Main Content */}
          <div className="space-y-8">
            {/* Quick Start Section */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-center">
              <h2 className="text-heading-2 font-semibold mb-4 text-white">
                Ready to Challenge Your Mind?
              </h2>
              <button
                onClick={handleStartQuiz}
                className="bg-white text-blue-600 px-8 py-3 rounded-lg text-body-large font-semibold"
              >
                <span className="flex items-center justify-center space-x-2">
                  <span>🚀</span>
                  <span>{t('startQuiz')}</span>
                </span>
              </button>
            </div>

            {/* Categories Section */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: '🧠', title: 'General Knowledge', color: 'bg-green-600' },
                { icon: '🔬', title: 'Science', color: 'bg-blue-600' },
                { icon: '🏛️', title: 'History', color: 'bg-yellow-600' },
                { icon: '🎨', title: 'Arts', color: 'bg-purple-600' },
              ].map((category, index) => (
                <div
                  key={index}
                  className={`${category.color} rounded-xl p-4 text-center text-white cursor-pointer`}
                >
                  <div className="text-2xl mb-2">{category.icon}</div>
                  <div className="text-body font-medium">{category.title}</div>
                </div>
              ))}
            </div>

            {/* Stats Section */}
            <div className="glass rounded-xl p-6">
              <h3 className="text-heading-3 font-semibold mb-4 text-white">Your Stats</h3>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-heading-2 font-bold text-blue-400">0</div>
                  <div className="text-caption text-gray-400">Games Played</div>
                </div>
                <div>
                  <div className="text-heading-2 font-bold text-green-400">0</div>
                  <div className="text-caption text-gray-400">Wins</div>
                </div>
                <div>
                  <div className="text-heading-2 font-bold text-yellow-400">0</div>
                  <div className="text-caption text-gray-400">Points</div>
                </div>
              </div>
            </div>

            {/* Additional Stats Cards */}
            <div className="grid grid-cols-2 gap-4">
              <div className="glass rounded-xl p-4 text-center">
                <div className="text-heading-3 text-blue-400 font-semibold">1.2K+</div>
                <div className="text-caption text-gray-400 mt-1">Active Players</div>
              </div>
              <div className="glass rounded-xl p-4 text-center">
                <div className="text-heading-3 text-green-400 font-semibold">50+</div>
                <div className="text-caption text-gray-400 mt-1">Quiz Categories</div>
              </div>
            </div>
          </div>
        </div>
      </MainLayout>
    </Page>
  );
}