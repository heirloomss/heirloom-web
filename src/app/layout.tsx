import type { Metadata, Viewport } from 'next';
import { Cormorant_Garamond, IBM_Plex_Mono, Inter } from 'next/font/google';
import { Providers } from '@/components/shared/Providers';
import './globals.css';

/**
 * Root layout — fonts, providers, and the shared paper ambience.
 * Satoshi is specified as the body typeface in the PRD but is not hosted on
 * Google Fonts (it is a commercial Fontshare family), so we load Inter as the
 * practical fallback and keep Satoshi first in the stack for users who have it.
 */

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-display',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

const plexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono',
});

export const metadata: Metadata = {
  title: {
    default: 'Heirloom — Your legacy, thoughtfully prepared.',
    template: '%s · Heirloom',
  },
  description:
    'Heirloom is a digital legacy platform. Preserve what matters. Protect those who matter — beneficiaries, documents, memories, and the certainty that love deserves a plan that lasts.',
};

export const viewport: Viewport = {
  themeColor: '#F8F4EC',
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${cormorant.variable} ${inter.variable} ${plexMono.variable}`}>
      <body className="paper-grain paper-vignette min-h-screen bg-paper font-sans text-ink antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
