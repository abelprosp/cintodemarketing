'use client'

import { useEffect } from 'react'

interface GoogleAdProps {
  position: 'top' | 'sidebar' | 'bottom'
  className?: string
}

declare global {
  interface Window {
    adsbygoogle: any[]
  }
}

export function GoogleAd({ position, className }: GoogleAdProps) {
  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && window.adsbygoogle) {
        window.adsbygoogle.push({})
      }
    } catch (err) {
      console.error('Erro ao carregar anúncio:', err)
    }
  }, [])

  const getAdConfig = () => {
    switch (position) {
      case 'top':
        return {
          containerStyle: { 
            display: 'block' as const, 
            width: '100%', 
            minHeight: '100px', 
            margin: '1rem 0',
            textAlign: 'center' as const
          },
          adStyle: { 
            display: 'block' as const,
            width: '100%',
            minHeight: '100px'
          },
          adFormat: 'auto',
          fullWidthResponsive: 'true'
        }
      case 'sidebar':
        return {
          containerStyle: { 
            display: 'block' as const, 
            width: '100%',
            maxWidth: '300px',
            minHeight: '250px',
            margin: '0 auto',
            textAlign: 'center' as const
          },
          adStyle: { 
            display: 'block' as const,
            width: '100%',
            minHeight: '250px'
          },
          adFormat: 'auto',
          fullWidthResponsive: 'true'
        }
      case 'bottom':
        return {
          containerStyle: { 
            display: 'block' as const, 
            width: '100%', 
            minHeight: '100px', 
            margin: '1rem 0',
            textAlign: 'center' as const
          },
          adStyle: { 
            display: 'block' as const,
            width: '100%',
            minHeight: '100px'
          },
          adFormat: 'auto',
          fullWidthResponsive: 'true'
        }
      default:
        return {
          containerStyle: { display: 'block' as const, textAlign: 'center' as const },
          adStyle: { display: 'block' as const },
          adFormat: 'auto',
          fullWidthResponsive: 'true'
        }
    }
  }

  const config = getAdConfig()

  return (
    <div className={className} style={config.containerStyle}>
      <ins
        className="adsbygoogle"
        style={config.adStyle}
        data-ad-client="ca-pub-1924244368077847"
        data-ad-format={config.adFormat}
        data-full-width-responsive={config.fullWidthResponsive}
      />
    </div>
  )
}

