'use client';

import { useTranslations } from 'next-intl';
import { Page } from '@/components/Page';
import { MainLayout } from '@/components/MainLayout';
import { LanguageSelector } from '@/components/LanguageSelector';

export default function Settings() {
  const t = useTranslations('settings');

  const settingsItems = [
    {
      icon: '🌐',
      title: t('language'),
      component: <LanguageSelector />
    },
    {
      icon: '🎨',
      title: t('theme'),
      description: 'Dark Mode (Default)',
      action: () => console.log('Theme settings')
    },
    {
      icon: '🔔',
      title: t('notifications'),
      description: 'Manage notification preferences',
      action: () => console.log('Notification settings')
    },
    {
      icon: 'ℹ️',
      title: t('about'),
      description: 'App version and information',
      action: () => console.log('About page')
    }
  ];

  return (
    <Page back={false}>
      <MainLayout>
        <div className="min-h-screen p-4 space-y-6">


          {/* Settings Items */}
          <div className="space-y-5 animate-slide-up">
            {settingsItems.map((item, index) => (
              <div
                key={index}
                className="glass rounded-2xl p-6 border border-gray-600 hover:border-gray-500 transition-smooth hover:scale-[1.01] active:scale-[0.99] shadow-medium hover:shadow-strong w-full max-w-none"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {item.component ? (
                  // Language Selector Layout
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center text-2xl shadow-glow">
                        {item.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-white text-heading-3 font-semibold">{item.title}</h3>
                        <p className="text-gray-400 text-body-small mt-1">Choose your preferred language</p>
                      </div>
                    </div>
                    <div className="pl-18 animate-fade-in">
                      {item.component}
                    </div>
                  </div>
                ) : (
                  // Other Settings Layout
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-5 flex-1">
                      <div className="w-14 h-14 bg-gray-700 rounded-2xl flex items-center justify-center text-2xl transition-smooth hover:bg-gray-600 shadow-soft">
                        {item.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-white text-heading-3 font-semibold">{item.title}</h3>
                        {item.description && (
                          <p className="text-gray-400 text-body-small mt-1">{item.description}</p>
                        )}
                      </div>
                    </div>
                    
                    <button
                      onClick={item.action}
                      className="w-12 h-12 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl transition-smooth hover:scale-110 active:scale-95 shadow-soft hover:shadow-glow flex items-center justify-center ml-4"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* App Info */}
          <div className="mt-8 animate-fade-in" style={{ animationDelay: '0.6s' }}>
            <div className="glass rounded-2xl p-8 text-center border border-gray-600 shadow-strong">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-blue-600 rounded-3xl flex items-center justify-center text-4xl mx-auto mb-4 shadow-glow animate-bounce-slow">
                🧠
              </div>
              <h3 className="text-heading-2 text-white mb-2 font-bold">Brain Arena</h3>
              <p className="text-body-large text-gray-300 mb-4 font-medium">Quiz Competition Platform</p>
              <div className="flex items-center justify-center space-x-2 text-body-small text-gray-400 mb-6">
                <span>Made with</span>
                <span className="text-red-400 animate-pulse text-lg">❤️</span>
                <span>for Telegram WebApp</span>
              </div>
              
              {/* Additional Info */}
              <div className="pt-6 border-t border-gray-700">
                <div className="grid grid-cols-3 gap-6 text-center">
                  <div className="space-y-2">
                    <div className="text-heading-3 text-blue-400 font-bold">v1.0.0</div>
                    <div className="text-caption text-gray-500">Version</div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-heading-3 text-green-400 font-bold">2024</div>
                    <div className="text-caption text-gray-500">Release</div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-heading-3 text-purple-400 font-bold">Free</div>
                    <div className="text-caption text-gray-500">License</div>
                  </div>
                </div>
              </div>
              
              {/* Developer Info */}
              <div className="mt-6 pt-4 border-t border-gray-700">
                <p className="text-caption text-gray-500">Developed for competitive quiz gaming</p>
              </div>
            </div>
          </div>
        </div>
      </MainLayout>
    </Page>
  );
}