import React from 'react';
import type { Metadata } from 'next';
import { SessionProviderWrapper } from '@components/SessionProviderWrapper';

export const metadata: Metadata = {
  title: 'KILIL Education Platform',
  description: 'Multi-university, multi-campus platform for Ethiopia',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <SessionProviderWrapper>
          {children}
        </SessionProviderWrapper>
      </body>
    </html>
  );
}