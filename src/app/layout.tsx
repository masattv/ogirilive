import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/common/Header';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: '大喜利ライブ',
  description: 'AIが評価する大喜利ライブ',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className={`${inter.className} bg-gray-900 text-white min-h-screen`}>
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
      </body>
    </html>
  );
} 