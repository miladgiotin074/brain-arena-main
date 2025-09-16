'use client';

import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { hapticFeedback, initData, useSignal } from '@telegram-apps/sdk-react';
import { Play, PlayIcon, PlaySquare } from 'lucide-react';
import Image from 'next/image';
import { Page } from '@/components/Page';
import { MainLayout } from '@/components/MainLayout';
import { useAuth } from '@/hooks/useAuth';
import { useAuthValidation } from '@/hooks/useAuthValidation';

export default function Home() {
  const router = useRouter();
  const t = useTranslations('home');
  const initDataUser = useSignal(initData.user);
  const { user, isLoading, error } = useAuth();
  const authValidation = useAuthValidation();

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

  // Show loading state while auth validation is in progress
  if (authValidation.isLoading) {
    return (
      <Page back={false}>
        <MainLayout>
          <div className="min-h-screen p-3 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-400">{t('loading')}</p>
            </div>
          </div>
        </MainLayout>
      </Page>
    );
  }

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
              {/* Top Right Icons */}
              <div className="absolute top-0 right-0 flex items-center space-x-2 rtl:space-x-reverse">
                {/* Notification Icon */}
                <button className="w-10 h-10 bg-gray-700/50 hover:bg-gray-600/50 backdrop-blur-sm rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 border border-gray-600/30">
                  <svg className="w-5 h-5 text-gray-300 hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.73 21a2 2 0 0 1-3.46 0" />
                  </svg>
                  {/* Notification Badge */}
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold text-white">3</span>
                  </div>
                </button>
                
                {/* Sound Mute/Unmute Icon */}
                <button className="w-10 h-10 bg-gray-700/50 hover:bg-gray-600/50 backdrop-blur-sm rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 border border-gray-600/30">
                  <svg className="w-5 h-5 text-gray-300 hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M11 5L6 9H2v6h4l5 4V5z" />
                  </svg>
                </button>
              </div>
              
              {/* Header Section */}
              <div className="flex items-start space-x-3 rtl:space-x-reverse mb-4">
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center overflow-hidden shadow-lg ring-2 ring-white/10">
                    {user?.photoUrl ? (
                      <Image 
                        src={user.photoUrl} 
                        alt="Profile" 
                        width={64}
                        height={64}
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
                      {isLoading ? (
                        <div className="h-6 bg-gray-600 rounded animate-pulse w-32"></div>
                      ) : user ? 
                        `${user.firstName}${user.lastName ? ` ${user.lastName}` : ''}` : 
                        t('profile.guestUser')
                      }
                    </h3>
                    {user?.isPremium && (
                      <div className="flex-shrink-0 px-2 py-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full">
                        <span className="text-xs font-semibold text-white">PRO</span>
                      </div>
                    )}
                  </div>
                  {user?.username && (
                    <p className="text-sm text-blue-400 mb-2 flex items-center space-x-1 rtl:space-x-reverse">
                      <span>@{user.username}</span>
                      <svg className="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </p>
                  )}
                </div>
              </div>
              
              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-2 mb-4">
                <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-2 text-center border border-slate-700/50">
                  <div className="flex items-center justify-center mb-0.5">
                    <span className="text-sm">🪙</span>
                  </div>
                  <div className="text-sm font-bold text-yellow-400 mb-0.5">
                    {isLoading ? (
                      <div className="h-4 bg-gray-600 rounded animate-pulse w-8 mx-auto"></div>
                    ) : (
                      user?.coins || 0
                    )}
                  </div>
                  <div className="text-xs text-slate-300 font-medium">{t('profile.coins')}</div>
                </div>
                
                <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-2 text-center border border-slate-700/50">
                  <div className="flex items-center justify-center mb-0.5">
                    <span className="text-sm">⭐</span>
                  </div>
                  <div className="text-sm font-bold text-blue-400 mb-0.5">
                    {isLoading ? (
                      <div className="h-4 bg-gray-600 rounded animate-pulse w-8 mx-auto"></div>
                    ) : (
                      user?.totalScore || 0
                    )}
                  </div>
                  <div className="text-xs text-slate-300 font-medium">{t('profile.score')}</div>
                </div>
                
                <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-2 text-center border border-slate-700/50">
                  <div className="flex items-center justify-center mb-0.5">
                    <span className="text-sm">🎯</span>
                  </div>
                  <div className="text-sm font-bold text-green-400 mb-0.5">
                    {isLoading ? (
                      <div className="h-4 bg-gray-600 rounded animate-pulse w-8 mx-auto"></div>
                    ) : (
                      user?.level || 1
                    )}
                  </div>
                  <div className="text-xs text-slate-300 font-medium">{t('profile.level')}</div>
                </div>
              </div>
              
              {/* Progress Section */}
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-3 border border-slate-700/50">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-slate-300">{t('profile.progressToNext')}</span>
                  <span className="text-xs font-bold text-white">
                    {isLoading ? (
                      <div className="h-3 bg-gray-600 rounded animate-pulse w-16"></div>
                    ) : (
                      `${user ? user.xp % 1000 : 0}/1000 ${t('profile.xp')}`
                    )}
                  </span>
                </div>
                <div className="relative h-3 bg-slate-700 rounded-full overflow-hidden">
                  {isLoading ? (
                    <div className="absolute inset-0 bg-gray-600 rounded-full animate-pulse"></div>
                  ) : (
                    <>
                      <div 
                        className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full" 
                        style={{width: `${user ? (user.xp % 1000) / 10 : 0}%`}}
                      ></div>
                      <div 
                        className="absolute inset-0 bg-gradient-to-r from-blue-500/50 via-purple-500/50 to-pink-500/50 rounded-full animate-pulse" 
                        style={{width: `${user ? (user.xp % 1000) / 10 : 0}%`}}
                      ></div>
                    </>
                  )}
                </div>
                <div className="flex justify-between mt-2 text-xs text-slate-400">
                  <span>{t('profile.level')} {user?.level || 1}</span>
                  <span>{t('profile.level')} {(user?.level || 1) + 1}</span>
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
              <span className="text-xl group-hover:rotate-12 group-hover:scale-110 transition-all duration-300" style={{animation: 'shakeRotatePause 3.5s ease-in-out infinite'}}>🏆</span>
              <div className="w-2"></div>
              <span className="text-lg font-bold group-hover:translate-x-1 transition-transform duration-300">{t('startNewGame')}</span>
              
            </button>
          </div>

          {/* Your Turn Section */}
          <div className="mt-8">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-4 space-y-3">
              <div className="flex items-center mb-4">
                <div className="text-2xl mr-3 rtl:ml-3 rtl:mr-0">
                  🎮
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
                      <div className="text-blue-300 font-bold text-sm">{t('game.waiting')}</div>
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
          <div className="mt-8 opacity-60">
            <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-4 space-y-3">
              <div className="flex items-center mb-4">
                <div className="text-2xl mr-3 rtl:ml-3 rtl:mr-0 opacity-70">
                  ⏳
                </div>
                <h2 className="text-xl font-bold text-gray-400">{t('game.opponentTurn')}</h2>
              </div>
              <div className="bg-gray-700/30 rounded-xl p-4 flex items-center space-x-3 rtl:space-x-reverse">
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-500/60 to-red-600/60 rounded-full flex items-center justify-center text-gray-300 font-bold">
                    M
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500/60 rounded-full border-2 border-gray-700"></div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-gray-400 font-semibold">محمد کریمی</h3>
                      <p className="text-gray-500 text-sm">@mohammad_karimi</p>
                    </div>
                    <div className="text-right">
                      <div className="text-orange-400/70 font-bold text-sm">{t('game.theirMove')}</div>
                    </div>
                  </div>
                  <div className="text-gray-500 text-xs mt-1">{t('game.gameStarted')} 1 {t('game.dayAgo')}</div>
                </div>
              </div>

              <div className="bg-gray-700/30 rounded-xl p-4 flex items-center space-x-3 rtl:space-x-reverse">
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500/60 to-pink-600/60 rounded-full flex items-center justify-center text-gray-300 font-bold">
                    R
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-gray-500/60 rounded-full border-2 border-gray-700"></div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-gray-400 font-semibold">رضا احمدی</h3>
                      <p className="text-gray-500 text-sm">@reza_ahmadi</p>
                    </div>
                    <div className="text-right">
                      <div className="text-red-400/70 font-bold text-sm">{t('game.thinking')}</div>
                    </div>
                  </div>
                  <div className="text-gray-500 text-xs mt-1">{t('game.gameStarted')} 3 {t('game.hoursAgo')}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Finished Games Section */}
          <div className="mt-8">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-4 space-y-3">
              <div className="flex items-center mb-4">
                <div className="text-2xl mr-3 rtl:ml-3 rtl:mr-0">
                  🏁
                </div>
                <h2 className="text-xl font-bold text-white">{t('game.finishedGames')}</h2>
              </div>
              
              <div className="bg-gray-700/50 rounded-xl p-4 flex items-center space-x-3 rtl:space-x-reverse">
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold">
                    A
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-yellow-500 rounded-full border-2 border-gray-700 flex items-center justify-center">
                    <span className="text-xs">👑</span>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-white font-semibold">علی رضایی</h3>
                      <p className="text-gray-400 text-sm">@ali_rezaei</p>
                    </div>
                    <div className="text-right">
                      <div className="text-green-400 font-bold text-sm">{t('game.won')}</div>
                      <div className="text-gray-400 text-xs">15-12</div>
                    </div>
                  </div>
                  <div className="text-gray-400 text-xs mt-1">{t('game.finished')} 2 {t('game.hoursAgo')}</div>
                </div>
              </div>

              <div className="bg-gray-700/50 rounded-xl p-4 flex items-center space-x-3 rtl:space-x-reverse">
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-600 rounded-full flex items-center justify-center text-white font-bold">
                    N
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-gray-700 flex items-center justify-center">
                    <span className="text-xs">💔</span>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-white font-semibold">نیما حسینی</h3>
                      <p className="text-gray-400 text-sm">@nima_hosseini</p>
                    </div>
                    <div className="text-right">
                      <div className="text-red-400 font-bold text-sm">{t('game.lost')}</div>
                      <div className="text-gray-400 text-xs">8-15</div>
                    </div>
                  </div>
                  <div className="text-gray-400 text-xs mt-1">{t('game.finished')} 1 {t('game.dayAgo')}</div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </MainLayout>
    </Page>
  );
}