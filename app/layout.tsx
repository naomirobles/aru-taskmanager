// app/layout.tsx
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import Header from '@/components/header';
import './globals.css';
import { SpeedInsights } from '@vercel/speed-insights/next';

import ClerkProviderWrapper from '@/components/ClerkProviderWrapper';
import { ThemeProvider } from '@/components/ThemeProvider';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Aru Task Manager',
  description: 'Gestiona tus tareas de manera eficiente',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const theme = localStorage.getItem('theme') ||
                  (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
                if (theme === 'dark') {
                  document.documentElement.classList.add('dark');
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 transition-colors duration-200`}>
        <ThemeProvider>
          <ClerkProviderWrapper>
            <Header />
            {children}
            <SpeedInsights />
          </ClerkProviderWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}
