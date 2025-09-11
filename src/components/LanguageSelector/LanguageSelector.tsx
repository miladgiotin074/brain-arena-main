'use client';

import { useTranslations, useLocale } from 'next-intl';
import { useCallback, useTransition, useState } from 'react';
import { useRouter } from 'next/navigation';
import { localesMap } from '@/core/i18n/config';
import { setLocale } from '@/core/i18n/locale';

export function LanguageSelector() {
  const t = useTranslations('home');
  const currentLocale = useLocale();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);

  const handleLanguageChange = useCallback(async (locale: string) => {
    if (locale === currentLocale) return;
    
    console.log(`Changing language to: ${locale}`);
    setIsOpen(false);
    await setLocale(locale);
    
    startTransition(() => {
      router.refresh();
    });
  }, [currentLocale, router]);

  const currentLanguage = localesMap.find(locale => locale.key === currentLocale);

  return (
    <div className="relative">
      {/* Dropdown Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isPending}
        className={`w-full min-w-[120px] px-4 py-3 bg-gray-700 hover:bg-gray-600 rounded-xl transition-smooth flex items-center justify-between text-white border border-gray-600 hover:border-gray-500 ${
          isPending ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:scale-[1.02] active:scale-[0.98]'
        }`}
      >
        <div className="flex items-center space-x-3">
          {isPending ? (
            <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
          ) : (
            <span className="text-lg">🌐</span>
          )}
          <span className="text-body-small font-medium">
            {isPending ? 'Changing...' : currentLanguage?.title || 'Select Language'}
          </span>
        </div>
        
        {/* Dropdown Arrow */}
        <svg 
          className={`w-4 h-4 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : 'rotate-0'
          }`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Menu */}
          <div className="absolute top-full left-0 right-0 mt-2 bg-gray-800 border border-gray-600 rounded-xl shadow-strong z-50 overflow-hidden animate-scale-in">
            {localesMap.map((locale, index) => {
              const isActive = locale.key === currentLocale;
              
              return (
                <button
                  key={locale.key}
                  onClick={() => handleLanguageChange(locale.key)}
                  disabled={isPending || isActive}
                  className={`w-full px-4 py-3 text-left transition-smooth flex items-center justify-between hover:bg-gray-700 ${
                    isActive 
                      ? 'bg-blue-600 text-white' 
                      : 'text-gray-300 hover:text-white'
                  } ${
                    index !== localesMap.length - 1 ? 'border-b border-gray-700' : ''
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">{locale.key === 'fa' ? '🇮🇷' : '🇺🇸'}</span>
                    <span className="text-body-small font-medium">{locale.title}</span>
                  </div>
                  
                  {isActive && (
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-blue-200">✓</span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}