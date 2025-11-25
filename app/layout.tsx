import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/ThemeProvider'
import Script from 'next/script'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Cinto do Marketing - Ferramentas Essenciais para Desenvolvedores',
  description: 'Formatador JSON/XML, Gerador de QR Code e Link WhatsApp. Ferramentas gratuitas e online para desenvolvedores e profissionais de marketing.',
  keywords: ['formatador json online', 'gerador qr code wifi', 'link whatsapp personalizado', 'xml beautifier', 'ferramentas marketing'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1924244368077847"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </head>
      <body className={inter.className}>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}

