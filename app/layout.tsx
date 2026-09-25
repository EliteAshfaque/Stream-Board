import type { Metadata } from 'next';

import './globals.css';

export const metadata: Metadata = {
  title: 'Pulse Monitor',
  description: 'A high-frequency, defensive live monitoring dashboard.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
