import type { PropsWithChildren } from 'react';
import type { Metadata } from 'next';
import { getLocale } from 'next-intl/server';

import { Root } from '@/components/Root/Root';
import { I18nProvider } from '@/core/i18n/provider';
import { UserProvider } from '@/contexts/UserContext';
import { SocketProvider } from '@/contexts/SocketContext';


import 'normalize.css/normalize.css';
import './_assets/globals.css';

export const metadata: Metadata = {
  title: 'Quiz Of The Kings',
  description: 'A Telegram web app for engaging in intelligence and general knowledge competitions',
};

export default async function RootLayout({ children }: PropsWithChildren) {
  const locale = await getLocale();
  const direction = locale === 'fa' ? 'rtl' : 'ltr';

  return (
    <html lang={locale} dir={direction} suppressHydrationWarning>
      <body className='bg-[#1a1a1a]'>
        <I18nProvider>
          <SocketProvider>
            <UserProvider>
              <Root>{children}</Root>
            </UserProvider>
          </SocketProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
