'use client';

import { type PropsWithChildren, useEffect, useState } from 'react';
import {
  initData,
  miniApp,
  useLaunchParams,
  useSignal,
} from '@telegram-apps/sdk-react';
import { useLocale } from 'next-intl';
// Removed @telegram-apps/telegram-ui dependency

import { ErrorBoundary } from '@/components/ErrorBoundary';
import { ErrorPage } from '@/components/ErrorPage';
import { useDidMount } from '@/hooks/useDidMount';
import { setLocale } from '@/core/i18n/locale';

import './styles.css';

function RootInner({ children }: PropsWithChildren) {
  const lp = useLaunchParams();
  const locale = useLocale();

  const isDark = useSignal(miniApp.isDark);
  const initDataUser = useSignal(initData.user);

  // Note: Default locale (English) is used instead of user's Telegram language

  // Set document direction based on locale
  useEffect(() => {
    const direction = locale === 'fa' ? 'rtl' : 'ltr';
    document.documentElement.dir = direction;
    document.documentElement.lang = locale;
  }, [locale]);

  return (
      <div 
        className={`app-root ${isDark ? 'dark' : 'light'} ${
          ['macos', 'ios'].includes(lp.tgWebAppPlatform) ? 'ios' : 'base'
        }`}
        dir={locale === 'fa' ? 'rtl' : 'ltr'}
      >
        {children}
      </div>
  );
}

export function Root(props: PropsWithChildren) {
  // Unfortunately, Telegram Mini Apps does not allow us to use all features of
  // the Server Side Rendering. That's why we are showing loader on the server
  // side.
  const didMount = useDidMount();
  const [isLoading, setIsLoading] = useState(true);

  // Ensure loading lasts at least 1 second
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (didMount && !isLoading) {
    return (
      <ErrorBoundary fallback={ErrorPage}>
        <RootInner {...props} />
      </ErrorBoundary>
    );
  }

  return (
    <div className="bg-black flex justify-center items-center h-screen">
      <div className="relative">
        <div className="w-12 h-12 border-4 border-gray-700 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    </div>
  );
}
