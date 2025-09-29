'use client';

import { NextIntlClientProvider } from 'next-intl';
import { ReactNode } from 'react';
import { messages } from './messages';

interface IntlProviderProps {
  children: ReactNode;
  locale: string;
}

export function IntlProvider({ children, locale }: IntlProviderProps) {
  return (
    <NextIntlClientProvider messages={messages[locale as keyof typeof messages]} locale={locale}>
      {children}
    </NextIntlClientProvider>
  );
}