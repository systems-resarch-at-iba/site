import type { Metadata, Viewport } from 'next'
import {
  Bricolage_Grotesque,
  Source_Serif_4,
  Inter,
  JetBrains_Mono,
} from 'next/font/google'
import './globals.css'
import 'katex/dist/katex.min.css'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from "@vercel/speed-insights/next"
import { ThemeSwitcher } from '@/components/layout/theme-switcher'
import { InteractiveDotGrid } from '@/components/effects/interactive-dot-grid'

const bricolage = Bricolage_Grotesque({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['400', '600', '700', '800'],
})

const sourceSerif = Source_Serif_4({
  subsets: ['latin'],
  variable: '--font-serif',
  weight: ['400', '600'],
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  weight: ['400', '500', '600'],
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  weight: ['400', '500'],
})

export const metadata: Metadata = {
  title: {
    default: 'Systems Research @ IBA',
    template: '%s | Systems Research @ IBA',
  },
  description: 'Research in systems design, architecture, and beyond.',
  verification: {
    google: 'N29n66A-R6UlUUjYwMZAIOKDKWKeQFZKrrmDS__cEB8',
  },
  // TODO: metadataBase needs a real URL object once the production domain
  // is known (new URL('https://...')); left unset until then.
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'To be added....',
    siteName: 'Systems Research @ IBA',
  },
  twitter: {
    card: 'summary_large_image',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#FAFAF9',
  width: 'device-width',
  initialScale: 1,
  userScalable: true,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${bricolage.variable} ${sourceSerif.variable} ${inter.variable} ${jetbrainsMono.variable}`}
    >
      <body className="bg-paper min-h-screen flex flex-col isolate">
        <InteractiveDotGrid />
        {children}
        <ThemeSwitcher />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
