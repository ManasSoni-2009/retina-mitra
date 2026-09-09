import type { Metadata } from 'next';
import { Outfit } from 'next/font/google';
import './globals.css';
import { AppSidebar } from '@/components/AppSidebar';
import { TopBar } from '@/components/TopBar';
import { AuthProvider } from '@/context/AuthContext';
import { SettingsProvider } from '@/context/SettingsContext';
import { SessionStoreProvider } from '@/hooks/useSessionStore';
import { ShieldAlert } from 'lucide-react';

const outfit = Outfit({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-outfit',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'RETINA-MITRA — Explainable AI Retinal Screening',
  description:
    'Quality-aware, explainable, human-in-the-loop diabetic retinopathy decision support for tele-ophthalmology screening. AI assists — ophthalmologists decide.',
  keywords: ['diabetic retinopathy', 'retinal screening', 'explainable AI', 'fundus photography', 'ophthalmology', 'decision support'],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={outfit.variable}>
      <body className={`${outfit.className} antialiased bg-[#F4F7FB] text-[#0F172A] min-h-screen flex`}>
        <SettingsProvider>
          <AuthProvider>
            <SessionStoreProvider>
              {/* Left Sidebar */}
              <AppSidebar />

              {/* Right Main Content Area */}
              <div className="lg:ml-64 flex-1 flex flex-col min-h-screen pt-14 lg:pt-0">
                <TopBar />
                <main className="flex-1">
                  {children}
                </main>

                <footer className="border-t border-slate-200/90 bg-white/80 dark:bg-[#0B1728]/90 backdrop-blur-md py-5 mt-auto">
                  <div className="px-6 sm:px-8 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-slate-500">
                    <p className="font-semibold text-slate-700 dark:text-slate-300">
                      © 2026 RETINA-MITRA · Tele-Ophthalmology Decision Support System.
                    </p>
                    <p className="text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-3.5 py-1.5 rounded-full border border-amber-200/80 dark:border-amber-800/80 font-semibold flex items-center gap-1.5 shadow-2xs">
                      <ShieldAlert className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                      Clinical Decision-Support Software · Not an Autonomous Diagnostic System
                    </p>
                  </div>
                </footer>
              </div>
            </SessionStoreProvider>
          </AuthProvider>
        </SettingsProvider>
      </body>
    </html>
  );
}
