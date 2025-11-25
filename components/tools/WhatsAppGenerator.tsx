'use client'

import { useState } from 'react'

export function WhatsAppGenerator() {
  const [phone, setPhone] = useState('')
  const [message, setMessage] = useState('')
  const [generatedLink, setGeneratedLink] = useState('')

  const formatPhone = (phone: string) => {
    // Remove tudo exceto números
    const numbers = phone.replace(/\D/g, '')
    return numbers
  }

  const generateLink = () => {
    const formattedPhone = formatPhone(phone)
    
    if (!formattedPhone || formattedPhone.length < 10) {
      alert('Por favor, insira um número de telefone válido com DDD')
      return
    }

    let waLink = `https://wa.me/${formattedPhone}`
    
    if (message.trim()) {
      const encodedMessage = encodeURIComponent(message.trim())
      waLink += `?text=${encodedMessage}`
    }
    
    setGeneratedLink(waLink)
  }

  const copyLink = () => {
    if (generatedLink) {
      navigator.clipboard.writeText(generatedLink)
      alert('Link copiado para a área de transferência!')
    }
  }

  const testLink = () => {
    if (generatedLink) {
      window.open(generatedLink, '_blank')
    }
  }

  const clearAll = () => {
    setPhone('')
    setMessage('')
    setGeneratedLink('')
  }

  return (
    <div style={{
      background: 'rgba(26, 26, 36, 0.6)',
      backdropFilter: 'blur(10px)',
      borderRadius: '1rem',
      padding: '2rem',
      border: '1px solid var(--card-border)',
      boxShadow: '0 8px 32px rgba(139, 92, 246, 0.2), 0 0 0 1px rgba(139, 92, 246, 0.1)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '2px',
        background: 'linear-gradient(90deg, transparent, var(--primary-glow), transparent)',
        opacity: 0.6
      }} />
      <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem', fontWeight: '600' }}>
        Gerador de Link WhatsApp
      </h2>

      <div style={{ marginBottom: '1.5rem' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
          Número do Celular (com DDD)
        </label>
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="55 11 99999-9999"
          style={{
            width: '100%',
            padding: '0.75rem',
            border: '1px solid var(--border)',
            borderRadius: '0.5rem',
            background: 'var(--input)',
            color: 'var(--foreground)',
            fontSize: '1rem'
          }}
        />
        <div style={{ marginTop: '0.25rem', fontSize: '0.75rem', color: 'var(--muted-foreground)' }}>
          Exemplo: 55 11 99999-9999 ou 5511999999999
        </div>
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
          Mensagem Opcional
        </label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Olá, gostaria de mais informações..."
          style={{
            width: '100%',
            minHeight: '120px',
            padding: '0.75rem',
            border: '1px solid var(--border)',
            borderRadius: '0.5rem',
            background: 'var(--input)',
            color: 'var(--foreground)',
            fontSize: '1rem',
            resize: 'vertical',
            fontFamily: 'inherit'
          }}
        />
        <div style={{ marginTop: '0.25rem', fontSize: '0.75rem', color: 'var(--muted-foreground)' }}>
          {message.length} caracteres
        </div>
      </div>

      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
        <button
          onClick={generateLink}
          style={{
            padding: '0.75rem 1.5rem',
            background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
            color: 'white',
            border: 'none',
            borderRadius: '0.5rem',
            cursor: 'pointer',
            fontWeight: '500',
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 15px rgba(139, 92, 246, 0.4)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)'
            e.currentTarget.style.boxShadow = '0 6px 20px rgba(139, 92, 246, 0.6), 0 0 20px var(--purple-glow)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.boxShadow = '0 4px 15px rgba(139, 92, 246, 0.4)'
          }}
        >
          Gerar Link
        </button>
        <button
          onClick={copyLink}
          disabled={!generatedLink}
          style={{
            padding: '0.75rem 1.5rem',
            background: generatedLink 
              ? 'linear-gradient(135deg, var(--success), #059669)' 
              : 'rgba(139, 92, 246, 0.1)',
            color: generatedLink ? 'white' : 'var(--muted-foreground)',
            border: generatedLink ? 'none' : '1px solid var(--card-border)',
            borderRadius: '0.5rem',
            cursor: generatedLink ? 'pointer' : 'not-allowed',
            fontWeight: '500',
            transition: 'all 0.3s ease',
            boxShadow: generatedLink ? '0 4px 15px rgba(16, 185, 129, 0.4)' : 'none'
          }}
          onMouseEnter={(e) => {
            if (generatedLink) {
              e.currentTarget.style.transform = 'translateY(-2px)'
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(16, 185, 129, 0.6)'
            }
          }}
          onMouseLeave={(e) => {
            if (generatedLink) {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = '0 4px 15px rgba(16, 185, 129, 0.4)'
            }
          }}
        >
          Copiar Link
        </button>
        <button
          onClick={testLink}
          disabled={!generatedLink}
          style={{
            padding: '0.75rem 1.5rem',
            background: generatedLink 
              ? 'linear-gradient(135deg, var(--primary), var(--secondary))' 
              : 'rgba(139, 92, 246, 0.1)',
            color: generatedLink ? 'white' : 'var(--muted-foreground)',
            border: generatedLink ? 'none' : '1px solid var(--card-border)',
            borderRadius: '0.5rem',
            cursor: generatedLink ? 'pointer' : 'not-allowed',
            fontWeight: '500',
            transition: 'all 0.3s ease',
            boxShadow: generatedLink ? '0 4px 15px rgba(139, 92, 246, 0.4)' : 'none'
          }}
          onMouseEnter={(e) => {
            if (generatedLink) {
              e.currentTarget.style.transform = 'translateY(-2px)'
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(139, 92, 246, 0.6), 0 0 20px var(--purple-glow)'
            }
          }}
          onMouseLeave={(e) => {
            if (generatedLink) {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = '0 4px 15px rgba(139, 92, 246, 0.4)'
            }
          }}
        >
          Testar Link
        </button>
        <button
          onClick={clearAll}
          style={{
            padding: '0.75rem 1.5rem',
            background: 'var(--muted)',
            color: 'var(--foreground)',
            border: '1px solid var(--border)',
            borderRadius: '0.5rem',
            cursor: 'pointer',
            fontWeight: '500',
            transition: 'all 0.2s'
          }}
        >
          Limpar
        </button>
      </div>

      {generatedLink && (
        <div style={{
          padding: '1rem',
          background: 'var(--muted)',
          border: '1px solid var(--border)',
          borderRadius: '0.5rem',
          wordBreak: 'break-all'
        }}>
          <div style={{ marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.875rem' }}>
            Link Gerado:
          </div>
          <div style={{
            color: 'var(--primary)',
            fontSize: '0.875rem',
            padding: '0.5rem',
            background: 'var(--input)',
            borderRadius: '0.25rem',
            fontFamily: 'monospace'
          }}>
            {generatedLink}
          </div>
        </div>
      )}
    </div>
  )
}

