'use client';

import { Page } from '@/components/Page';

export default function Home() {
  const handleButtonClick = () => {
    console.log('دکمه کلیک شد!');
  };

  return (
    <Page back={false}>
      <div className="bg-yellow-500">
      </div>
    </Page>
  );
}
