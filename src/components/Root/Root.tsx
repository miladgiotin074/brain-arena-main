'use client';

import { type PropsWithChildren, useEffect } from 'react';
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

  // Set the user locale.
  useEffect(() => {
    initDataUser && setLocale(initDataUser.language_code);
  }, [initDataUser]);

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

  return didMount ? (
    <ErrorBoundary fallback={ErrorPage}>
      <RootInner {...props} />
    </ErrorBoundary>
  ) : (
    <div className="text-white flex justify-center items-center h-screen">Loading.....</div>
  );
}
