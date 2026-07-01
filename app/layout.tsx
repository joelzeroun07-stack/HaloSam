import type { Metadata } from 'next'
import { Plus_Jakarta_Sans, JetBrains_Mono } from 'next/font/google'
import { ThemeProvider } from 'next-themes'
import Providers from '@/components/Providers'
import './globals.css'

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
  weight: ['400', '500', '600', '700', '800'],
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  weight: ['400', '500', '600'],
})

export const metadata: Metadata = {
  title: 'Halo Sam! — Discover Malang Smart Tourism',
  description:
    'Platform wisata cerdas untuk menjelajahi permata tersembunyi di Malang Raya. Rekomendasi AI, laporan keramaian real-time, dan komunitas traveler.',
  keywords: ['malang', 'wisata', 'tourism', 'jawa timur', 'hidden gems', 'smart tourism'],
  openGraph: {
    title: 'Halo Sam! — Discover Malang Smart Tourism',
    description: 'Jelajahi sisi lain Malang yang belum pernah kamu temukan sebelumnya.',
    type: 'website',
  },
  icons: {
    icon: "/HaloSam.png",
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
        />
      </head>
      <body className={`${jakarta.variable} ${jetbrainsMono.variable} font-body bg-bg antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          storageKey="halosam_theme"
          enableSystem={false}
        >
          <Providers>
            {children}
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  )
}
