import type { Metadata } from 'next';

import { AppProviders } from '@/src/providers/AppProviders';

import './globals.css';

export const metadata: Metadata = {
  title: 'Pulse Monitor | Live Operations',
  applicationName: 'Pulse Monitor',
  description: 'A live operations dashboard with defended streams and cached public activity.',
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
