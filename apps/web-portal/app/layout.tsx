import React from 'react';
import type { Metadata } from 'next';
import { SessionProvider } from "next-auth/react";

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
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}