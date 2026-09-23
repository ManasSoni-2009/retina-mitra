import type { Metadata, Viewport } from 'next';
import { Bricolage_Grotesque, Geist_Mono } from 'next/font/google';
import './globals.css';
import { NavigationDock } from '@/components/NavigationDock';
import { CustomCursor } from '@/components/CustomCursor';
import { PreloaderReveal } from '@/components/PreloaderReveal';
import { LenisProvider } from '@/components/LenisProvider';
import { AuthProvider } from '@/context/AuthContext';
import { SettingsProvider } from '@/context/SettingsContext';
import { SessionStoreProvider } from '@/hooks/useSessionStore';

const bricolage = Bricolage_Grotesque({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-bricolage',
  display: 'swap',
});

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
  display: 'swap',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#FAFAFA',
};

export const metadata: Metadata = {
  title: 'Retina-Mitra — Explainable Retinal Decision Support',
  description:
    'Quality-aware, explainable, human-in-the-loop diabetic retinopathy screening decision support. OpenCV quality gating, PyTorch ICDR classification, Grad-CAM attention.',
  keywords: [
    'diabetic retinopathy',
    'retinal screening',
    'explainable AI',
    'fundus photography',
    'ophthalmology',
    'decision support',
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${bricolage.variable} ${geistMono.variable}`}>
      <body className="font-sans antialiased bg-[var(--bg)] text-[var(--ink)] min-h-screen">
        <SettingsProvider>
          <AuthProvider>
            <SessionStoreProvider>
              <LenisProvider>
                <PreloaderReveal />
                <CustomCursor />
                <NavigationDock />
                <main className="min-h-screen">
                  {children}
                </main>
              </LenisProvider>
            </SessionStoreProvider>
          </AuthProvider>
        </SettingsProvider>
      </body>
    </html>
  );
}
