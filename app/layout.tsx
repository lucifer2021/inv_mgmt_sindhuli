import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Business Management System',
  description: 'Manage your business efficiently',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex min-h-screen flex-col">
          <main className="flex-1">{children}</main>
          <footer className="border-t py-4">
            <div className="container flex items-center justify-center text-sm">
              Created with <span className="mx-1">❤️</span> by{' '}
              <a
                href="https://www.bishnu.info.np/"
                target="_blank"
                rel="noopener noreferrer"
                className="ml-1 font-medium hover:underline"
              >
                Bishnu Thapa
              </a>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}