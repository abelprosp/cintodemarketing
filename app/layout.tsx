import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/ThemeProvider'

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
      <body className={inter.className}>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}

