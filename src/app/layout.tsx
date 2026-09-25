import type { Metadata } from 'next';

import { AppProviders } from '@/src/providers/AppProviders';

import './globals.css';

export const metadata: Metadata = {
  title: 'Stream Board',
  applicationName: 'Stream Board',
  description: 'Live monitoring dashboard for service events, latency, and health.',
  manifest: '/site.webmanifest',
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body><AppProviders>{children}</AppProviders></body>
    </html>
  );
}
