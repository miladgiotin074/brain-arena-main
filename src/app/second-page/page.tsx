'use client';
import { useTranslations } from 'next-intl';
import { Page } from '@/components/Page';

export default function LaunchParamsPage() {
  const t = useTranslations('secondPage');

  return (
    <Page>
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <h1 className="text-2xl font-bold mb-4">{t('title')}</h1>
        <p className="text-gray-600 text-center max-w-md">
          {t('description')}
        </p>
      </div>
    </Page>
  );
}