import type { Metadata } from 'next'
import { Libre_Baskerville } from 'next/font/google'
import './globals.css'

const baskerville = Libre_Baskerville({
  subsets: ['latin'],
  variable: '--font-baskerville',
  weight: ['400', '700'],
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
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className="dark">
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
        />
      </head>
      <body className={`${baskerville.variable} font-body bg-bg text-white antialiased`}>
        {children}
      </body>
    </html>
  )
}
