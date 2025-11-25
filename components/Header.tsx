'use client'

import { useTheme } from './ThemeProvider'
import { useEffect, useState } from 'react'

export function Header() {
  const [mounted, setMounted] = useState(false)
  const { theme, toggleTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <header style={{
        background: 'var(--card)',
        borderBottom: '1px solid var(--border)',
        padding: '1rem 0',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 'bold',
              fontSize: '1.25rem'
            }}>
              C
            </div>
            <div>
              <h1 style={{ fontSize: '1.25rem', fontWeight: 'bold', margin: 0 }}>
                Cinto do Marketing
              </h1>
              <p style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)', margin: 0 }}>
                Ferramentas Essenciais
              </p>
            </div>
          </div>
          <div style={{
            padding: '0.5rem 1rem',
            background: 'var(--input)',
            border: '1px solid var(--border)',
            borderRadius: '0.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.875rem'
          }}>
            <span>🌙</span>
            <span>Escuro</span>
          </div>
        </div>
      </header>
    )
  }

  return (
    <header style={{
      background: 'rgba(26, 26, 36, 0.8)',
      backdropFilter: 'blur(10px)',
      borderBottom: '1px solid var(--card-border)',
      padding: '1rem 0',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      boxShadow: '0 4px 20px rgba(139, 92, 246, 0.2)'
    }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 'bold',
            fontSize: '1.25rem',
            boxShadow: '0 0 20px var(--purple-glow)',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = '0 0 30px var(--purple-glow), 0 0 40px var(--blue-glow)'
            e.currentTarget.style.transform = 'scale(1.05)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = '0 0 20px var(--purple-glow)'
            e.currentTarget.style.transform = 'scale(1)'
          }}
          >
            C
          </div>
          <div>
            <h1 style={{ fontSize: '1.25rem', fontWeight: 'bold', margin: 0 }}>
              Cinto do Marketing
            </h1>
            <p style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)', margin: 0 }}>
              Ferramentas Essenciais
            </p>
          </div>
        </div>
        <button
          onClick={toggleTheme}
          style={{
            padding: '0.5rem 1rem',
            background: 'rgba(139, 92, 246, 0.1)',
            border: '1px solid var(--card-border)',
            borderRadius: '0.5rem',
            cursor: 'pointer',
            color: 'var(--foreground)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            transition: 'all 0.3s ease',
            boxShadow: '0 0 10px rgba(139, 92, 246, 0.2)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(139, 92, 246, 0.2)'
            e.currentTarget.style.boxShadow = '0 0 20px var(--purple-glow)'
            e.currentTarget.style.transform = 'translateY(-2px)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(139, 92, 246, 0.1)'
            e.currentTarget.style.boxShadow = '0 0 10px rgba(139, 92, 246, 0.2)'
            e.currentTarget.style.transform = 'translateY(0)'
          }}
        >
          {theme === 'light' ? '🌙' : '☀️'}
          <span style={{ fontSize: '0.875rem' }}>
            {theme === 'light' ? 'Escuro' : 'Claro'}
          </span>
        </button>
      </div>
    </header>
  )
}

