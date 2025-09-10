'use client';

import { useTranslations, useLocale } from 'next-intl';
import { useCallback, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { localesMap } from '@/core/i18n/config';
import { setLocale } from '@/core/i18n/locale';

export function LanguageSelector() {
  const t = useTranslations('home');
  const currentLocale = useLocale();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleLanguageChange = useCallback(async (locale: string) => {
    if (locale === currentLocale) return;
    
    console.log(`Changing language to: ${locale}`);
    await setLocale(locale);
    
    startTransition(() => {
      router.refresh();
    });
  }, [currentLocale, router]);

  return (
    <div className="mt-4">
      <p className="text-sm text-gray-600 mb-2 text-center">
        {t('selectLanguage')}
      </p>
      <div className="flex gap-2 justify-center">
        {localesMap.map((locale) => {
          const isActive = locale.key === currentLocale;
          const isDisabled = isPending || isActive;
          
          return (
            <button
              key={locale.key}
              onClick={() => handleLanguageChange(locale.key)}
              disabled={isDisabled}
              className={`px-4 py-2 rounded-md transition-colors duration-200 text-sm font-medium ${
                isActive
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              } ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              {isPending && !isActive ? '...' : locale.title}
            </button>
          );
        })}
      </div>
    </div>
  );
}