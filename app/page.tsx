'use client'

import { useState, useEffect } from 'react'
import { Header } from '@/components/Header'
import { AdPlaceholder } from '@/components/AdPlaceholder'
import { ToolTabs } from '@/components/ToolTabs'
import { JsonFormatter } from '@/components/tools/JsonFormatter'
import { QrCodeGenerator } from '@/components/tools/QrCodeGenerator'
import { WhatsAppGenerator } from '@/components/tools/WhatsAppGenerator'
import { JsonToToonConverter } from '@/components/tools/JsonToToonConverter'

export default function Home() {
  const [activeTab, setActiveTab] = useState('json')

  useEffect(() => {
    // Update meta tags based on active tab
    const titles: Record<string, string> = {
      json: 'Formatador JSON/XML Online - Cinto do Marketing',
      qrcode: 'Gerador de QR Code Gratuito - Cinto do Marketing',
      whatsapp: 'Gerador de Link WhatsApp - Cinto do Marketing',
      jsontoon: 'JSON to TOON Converter - Cinto do Marketing',
    }
    
    const descriptions: Record<string, string> = {
      json: 'Formate, valide e minifique código JSON e XML online. Ferramenta gratuita com syntax highlighting.',
      qrcode: 'Gere QR Codes personalizados para URL, Wi-Fi e VCard. Download em PNG, cores customizáveis.',
      whatsapp: 'Crie links personalizados do WhatsApp com mensagem pré-definida. Gratuito e fácil de usar.',
      jsontoon: 'Converta JSON para TOON (Token-Oriented Object Notation). Reduza tokens em 30-60% para LLMs.',
    }

    if (typeof document !== 'undefined') {
      document.title = titles[activeTab] || 'Cinto do Marketing'
      const metaDescription = document.querySelector('meta[name="description"]')
      if (metaDescription) {
        metaDescription.setAttribute('content', descriptions[activeTab] || '')
      }
    }
  }, [activeTab])

  const renderTool = () => {
    switch (activeTab) {
      case 'json':
        return <JsonFormatter />
      case 'qrcode':
        return <QrCodeGenerator />
      case 'whatsapp':
        return <WhatsAppGenerator />
      case 'jsontoon':
        return <JsonToToonConverter />
      default:
        return <JsonFormatter />
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />
      
      <main style={{ flex: 1, padding: '2rem 0' }}>
        <div className="container">
          {/* Top Ad */}
          <AdPlaceholder position="top" />
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'minmax(0, 1fr)',
            gap: '2rem',
            alignItems: 'start'
          }}
          className="main-grid"
          >
            {/* Main Content */}
            <div>
              <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
                <div style={{
                  display: 'inline-block',
                  padding: '0.5rem 1rem',
                  background: 'rgba(139, 92, 246, 0.1)',
                  border: '1px solid var(--card-border)',
                  borderRadius: '2rem',
                  marginBottom: '1rem',
                  fontSize: '0.875rem',
                  color: 'var(--primary-glow)',
                  boxShadow: '0 0 10px rgba(139, 92, 246, 0.2)'
                }}>
                  Ferramentas Essenciais em 1 Lugar
                </div>
                <h1 style={{ 
                  fontSize: 'clamp(1.75rem, 5vw, 2.5rem)', 
                  fontWeight: 'bold', 
                  marginBottom: '0.5rem',
                  background: 'linear-gradient(135deg, var(--primary-glow) 0%, var(--secondary-glow) 50%, var(--primary) 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  textShadow: '0 0 30px rgba(139, 92, 246, 0.5)',
                  filter: 'drop-shadow(0 0 10px rgba(139, 92, 246, 0.3))'
                }}>
                  Cinto do Marketing
                </h1>
                <p style={{ 
                  fontSize: 'clamp(0.875rem, 2vw, 1.125rem)', 
                  color: 'var(--muted-foreground)',
                  margin: 0,
                  maxWidth: '600px',
                  marginLeft: 'auto',
                  marginRight: 'auto'
                }}>
                  Explore mais ferramentas para assistência em desenvolvimento e marketing
                </p>
              </div>

              <ToolTabs activeTab={activeTab} onTabChange={setActiveTab} />
              
              {renderTool()}
            </div>

            {/* Sidebar with Ad - Hidden on mobile */}
            <aside style={{ 
              display: 'none',
              position: 'sticky', 
              top: '100px' 
            }}
            className="sidebar-ad"
            >
              <AdPlaceholder position="sidebar" />
            </aside>
          </div>

          {/* Bottom Ad */}
          <AdPlaceholder position="bottom" />
        </div>
      </main>

      <footer style={{
        background: 'rgba(26, 26, 36, 0.8)',
        backdropFilter: 'blur(10px)',
        borderTop: '1px solid var(--card-border)',
        padding: '2rem 0',
        marginTop: '3rem',
        textAlign: 'center',
        color: 'var(--muted-foreground)',
        fontSize: '0.875rem',
        boxShadow: '0 -4px 20px rgba(139, 92, 246, 0.1)'
      }}>
        <div className="container">
          <p style={{ margin: 0 }}>
            © 2024 Cinto do Marketing. Ferramentas gratuitas para desenvolvedores e profissionais de marketing.
          </p>
        </div>
      </footer>
    </div>
  )
}

