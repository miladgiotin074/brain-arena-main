'use client';

import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { hapticFeedback, initData, useSignal } from '@telegram-apps/sdk-react';
import { Play, PlayIcon, PlaySquare } from 'lucide-react';
import { Page } from '@/components/Page';
import { MainLayout } from '@/components/MainLayout';

export default function Home() {
  const router = useRouter();
  const t = useTranslations('home');
  const initDataUser = useSignal(initData.user);

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
        <div className="min-h-screen p-3">

          {/* Profile Card */}
          <div className="relative overflow-hidden bg-gradient-to-br from-slate-800/90 via-slate-900/90 to-black/90 backdrop-blur-xl rounded-2xl p-4 mb-6 border border-slate-700/50 shadow-2xl">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/8 via-purple-500/8 to-pink-500/8"></div>
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-blue-500/15 to-transparent rounded-full blur-xl"></div>
            <div className="absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-tr from-purple-500/15 to-transparent rounded-full blur-lg"></div>
            
            <div className="relative z-10">
              {/* Header Section */}
              <div className="flex items-start space-x-3 rtl:space-x-reverse mb-4">
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center overflow-hidden shadow-lg ring-2 ring-white/10">
                    {initDataUser?.photo_url ? (
                      <img 
                        src={initDataUser?.photo_url} 
                        alt="Profile" 
                        className="w-full h-full object-cover rounded-xl"
                      />
                    ) : (
                      <span className="text-2xl">👤</span>
                    )}
                  </div>
                  {/* Online Status */}
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-slate-800 flex items-center justify-center">
                    <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
                  </div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 rtl:space-x-reverse mb-1">
                    <h3 className="text-lg font-bold text-white truncate">
                      {initDataUser ? 
                        `${initDataUser?.first_name}${initDataUser?.last_name ? ` ${initDataUser?.last_name}` : ''}` : 
                        t('profile.guestUser')
                      }
                    </h3>
                    <div className="flex-shrink-0 px-2 py-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full">
                      <span className="text-xs font-semibold text-white">PRO</span>
                    </div>
                  </div>
                  {initDataUser?.username && (
                    <p className="text-sm text-blue-400 mb-2 flex items-center space-x-1 rtl:space-x-reverse">
                      <span>@{initDataUser.username}</span>
                      <svg className="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </p>
                  )}
                  
                  {/* Quick Stats */}
                  <div className="flex items-center space-x-3 rtl:space-x-reverse text-sm">
                    <div className="flex items-center space-x-1 rtl:space-x-reverse text-green-400">
                      <span className="text-sm">🏆</span>
                      <span className="font-semibold text-xs">#1</span>
                    </div>
                    <div className="flex items-center space-x-1 rtl:space-x-reverse text-blue-400">
                      <span className="text-sm">⚡</span>
                      <span className="font-semibold text-xs">15 {t('profile.thisWeek')}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-2 mb-4">
                <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-2 text-center border border-slate-700/50">
                  <div className="flex items-center justify-center mb-0.5">
                    <span className="text-sm">🪙</span>
                  </div>
                  <div className="text-sm font-bold text-yellow-400 mb-0.5">0</div>
                  <div className="text-xs text-slate-300 font-medium">{t('profile.coins')}</div>
                </div>
                
                <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-2 text-center border border-slate-700/50">
                  <div className="flex items-center justify-center mb-0.5">
                    <span className="text-sm">⭐</span>
                  </div>
                  <div className="text-sm font-bold text-blue-400 mb-0.5">10</div>
                  <div className="text-xs text-slate-300 font-medium">{t('profile.score')}</div>
                </div>
                
                <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-2 text-center border border-slate-700/50">
                  <div className="flex items-center justify-center mb-0.5">
                    <span className="text-sm">🎯</span>
                  </div>
                  <div className="text-sm font-bold text-green-400 mb-0.5">1</div>
                  <div className="text-xs text-slate-300 font-medium">{t('profile.level')}</div>
                </div>
              </div>
              
              {/* Progress Section */}
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-3 border border-slate-700/50">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-slate-300">{t('profile.progressToNext')}</span>
                  <span className="text-xs font-bold text-white">30/100 {t('profile.xp')}</span>
                </div>
                <div className="relative h-3 bg-slate-700 rounded-full overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full" style={{width: '30%'}}></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/50 via-purple-500/50 to-pink-500/50 rounded-full animate-pulse" style={{width: '30%'}}></div>
                </div>
                <div className="flex justify-between mt-2 text-xs text-slate-400">
                  <span>{t('profile.level')} 1</span>
                  <span>{t('profile.level')} 2</span>
                </div>
              </div>
            </div>
          </div>

          {/* Start New Game Button */}
          <div className="mb-6 flex justify-center">
            <button 
              onClick={handleStartQuiz}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-4 px-12 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-between group relative overflow-hidden"
            >
              <span className="text-xl group-hover:rotate-12 group-hover:scale-110 transition-all duration-300">🏆</span>
              <div className="w-2"></div>
              <span className="text-lg font-bold group-hover:translate-x-1 transition-transform duration-300">{t('startNewGame')}</span>
              
            </button>
          </div>

          {/* Your Turn Section */}
          <div className="mt-8">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-4 space-y-3">
              <div className="flex items-center mb-4">
                <div className="text-2xl mr-3 rtl:ml-3 rtl:mr-0">
                  🎯
                </div>
                <h2 className="text-xl font-bold text-white">{t('game.yourTurn')}</h2>
              </div>
              <div className="bg-gray-700/50 rounded-xl p-4 flex items-center space-x-3 rtl:space-x-reverse">
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                    A
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-gray-700"></div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-white font-semibold">احمد رضایی</h3>
                      <p className="text-gray-400 text-sm">@ahmad_rezaei</p>
                    </div>
                    <div className="text-right">
                      <div className="text-blue-400 font-bold text-sm">{t('game.waiting')}</div>
                    </div>
                  </div>
                  <div className="text-gray-400 text-xs mt-1">{t('game.gameStarted')} 2 {t('game.hoursAgo')}</div>
                </div>
              </div>

              <div className="bg-gray-700/50 rounded-xl p-4 flex items-center space-x-3 rtl:space-x-reverse">
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-600 rounded-full flex items-center justify-center text-white font-bold">
                    S
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-gray-500 rounded-full border-2 border-gray-700"></div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-white font-semibold">سارا محمدی</h3>
                      <p className="text-gray-400 text-sm">@sara_mohammadi</p>
                    </div>
                    <div className="text-right">
                      <div className="text-yellow-400 font-bold text-sm">{t('game.yourMove')}</div>
                    </div>
                  </div>
                  <div className="text-gray-400 text-xs mt-1">{t('game.gameStarted')} 5 {t('game.hoursAgo')}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Opponent Turn Section */}
          <div className="mt-8">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-4 space-y-3">
              <div className="flex items-center mb-4">
                <div className="text-2xl mr-3 rtl:ml-3 rtl:mr-0">
                  ⏳
                </div>
                <h2 className="text-xl font-bold text-white">{t('game.opponentTurn')}</h2>
              </div>
              <div className="bg-gray-700/50 rounded-xl p-4 flex items-center space-x-3 rtl:space-x-reverse">
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center text-white font-bold">
                    M
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-gray-700"></div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-white font-semibold">محمد کریمی</h3>
                      <p className="text-gray-400 text-sm">@mohammad_karimi</p>
                    </div>
                    <div className="text-right">
                      <div className="text-orange-400 font-bold text-sm">{t('game.theirMove')}</div>
                    </div>
                  </div>
                  <div className="text-gray-400 text-xs mt-1">{t('game.gameStarted')} 1 {t('game.dayAgo')}</div>
                </div>
              </div>

              <div className="bg-gray-700/50 rounded-xl p-4 flex items-center space-x-3 rtl:space-x-reverse">
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white font-bold">
                    R
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-gray-500 rounded-full border-2 border-gray-700"></div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-white font-semibold">رضا احمدی</h3>
                      <p className="text-gray-400 text-sm">@reza_ahmadi</p>
                    </div>
                    <div className="text-right">
                      <div className="text-red-400 font-bold text-sm">{t('game.thinking')}</div>
                    </div>
                  </div>
                  <div className="text-gray-400 text-xs mt-1">{t('game.gameStarted')} 3 {t('game.hoursAgo')}</div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </MainLayout>
    </Page>
  );
}