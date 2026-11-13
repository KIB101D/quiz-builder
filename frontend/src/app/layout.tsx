import { GeistMono } from 'geist/font/mono';
import { GeistSans } from 'geist/font/sans';
import type { Metadata, Viewport } from 'next';
import { SiteHeader } from '@/components/layout/site-header';
import './globals.css';

export const metadata: Metadata = {
  title: { default: 'Quiz Builder', template: '%s · Quiz Builder' },
  description: 'Create quizzes with true/false, short answer and multiple choice questions.',
};

export const viewport: Viewport = {
  themeColor: '#f6f4ef',
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className="flex min-h-dvh flex-col">
        <SiteHeader />
        <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-8 sm:px-6 sm:py-12">
          {children}
        </main>
      </body>
    </html>
  );
}
