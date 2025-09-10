'use client';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { Page } from '@/components/Page';
import { LanguageSelector } from '@/components/LanguageSelector';

export default function Home() {
  const router = useRouter();
  const t = useTranslations('home');

  const handleNavigateToSecondPage = useCallback(() => {
    console.log('Navigating to second page...');
    router.push('/second-page');
  }, [router]);

  return (
    <Page back={false}>
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <h1 className="text-2xl font-bold mb-8">{t('welcome')}</h1>
        <button
          onClick={handleNavigateToSecondPage}
          className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          {t('openSecondPage')}
        </button>
        <LanguageSelector />
      </div>
    </Page>
  );
}