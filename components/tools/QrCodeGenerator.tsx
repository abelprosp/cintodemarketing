'use client'

import { useState, useEffect } from 'react'
import QRCode from 'qrcode'

type QrType = 'url' | 'wifi' | 'vcard'

export function QrCodeGenerator() {
  const [qrType, setQrType] = useState<QrType>('url')
  const [qrCodeUrl, setQrCodeUrl] = useState('')
  const [foregroundColor, setForegroundColor] = useState('#000000')
  const [backgroundColor, setBackgroundColor] = useState('#FFFFFF')
  
  // URL inputs
  const [url, setUrl] = useState('')
  
  // WiFi inputs
  const [ssid, setSsid] = useState('')
  const [password, setPassword] = useState('')
  const [security, setSecurity] = useState('WPA/WPA2')
  
  // VCard inputs
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [company, setCompany] = useState('')

  const generateQrCode = async () => {
    try {
      let qrData = ''
      
      switch (qrType) {
        case 'url':
          if (!url.trim()) {
            alert('Por favor, insira uma URL')
            return
          }
          qrData = url.trim()
          break
          
        case 'wifi':
          if (!ssid.trim()) {
            alert('Por favor, insira o nome da rede')
            return
          }
          const auth = security === 'Sem senha' ? 'nopass' : security === 'WEP' ? 'WEP' : 'WPA'
          qrData = `WIFI:T:${auth};S:${ssid};P:${password};;`
          break
          
        case 'vcard':
          if (!name.trim() || !phone.trim()) {
            alert('Por favor, preencha pelo menos Nome e Telefone')
            return
          }
          qrData = `BEGIN:VCARD\nVERSION:3.0\nFN:${name}`
          if (phone) qrData += `\nTEL:${phone}`
          if (email) qrData += `\nEMAIL:${email}`
          if (company) qrData += `\nORG:${company}`
          qrData += '\nEND:VCARD'
          break
      }
      
      const dataUrl = await QRCode.toDataURL(qrData, {
        color: {
          dark: foregroundColor,
          light: backgroundColor,
        },
        width: 400,
        margin: 2,
      })
      
      setQrCodeUrl(dataUrl)
    } catch (error) {
      console.error('Erro ao gerar QR Code:', error)
      alert('Erro ao gerar QR Code. Tente novamente.')
    }
  }

  const downloadPng = () => {
    if (qrCodeUrl) {
      const link = document.createElement('a')
      link.href = qrCodeUrl
      link.download = `qrcode-${qrType}-${Date.now()}.png`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
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
        Gerador de QR Code Avançado
      </h2>

      {/* Type selector */}
      <div style={{ marginBottom: '1.5rem' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
          Tipo de QR Code
        </label>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {(['url', 'wifi', 'vcard'] as QrType[]).map(type => (
            <button
              key={type}
              onClick={() => setQrType(type)}
              style={{
                padding: '0.75rem 1.5rem',
                background: qrType === type ? 'var(--primary)' : 'var(--muted)',
                color: qrType === type ? 'white' : 'var(--foreground)',
                border: '1px solid var(--border)',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                fontWeight: '500',
                transition: 'all 0.2s',
                textTransform: 'capitalize'
              }}
            >
              {type === 'url' ? 'URL' : type === 'wifi' ? 'Wi-Fi' : 'VCard'}
            </button>
          ))}
        </div>
      </div>

      {/* URL inputs */}
      {qrType === 'url' && (
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
            URL do Site
          </label>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://exemplo.com"
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
        </div>
      )}

      {/* WiFi inputs */}
      {qrType === 'wifi' && (
        <div style={{ marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
              Nome da Rede (SSID)
            </label>
            <input
              type="text"
              value={ssid}
              onChange={(e) => setSsid(e.target.value)}
              placeholder="MinhaRedeWiFi"
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
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
              Senha
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Senha da rede"
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
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
              Tipo de Segurança
            </label>
            <select
              value={security}
              onChange={(e) => setSecurity(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid var(--border)',
                borderRadius: '0.5rem',
                background: 'var(--input)',
                color: 'var(--foreground)',
                fontSize: '1rem'
              }}
            >
              <option value="WPA/WPA2">WPA/WPA2</option>
              <option value="WEP">WEP</option>
              <option value="Sem senha">Sem senha</option>
            </select>
          </div>
        </div>
      )}

      {/* VCard inputs */}
      {qrType === 'vcard' && (
        <div style={{ marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
              Nome Completo
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="João Silva"
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
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
              Telefone
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+55 11 99999-9999"
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
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
              E-mail
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="joao@exemplo.com"
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
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
              Empresa
            </label>
            <input
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="Nome da Empresa"
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
          </div>
        </div>
      )}

      {/* Color customization */}
      <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
            Cor do QR Code
          </label>
          <input
            type="color"
            value={foregroundColor}
            onChange={(e) => setForegroundColor(e.target.value)}
            style={{
              width: '100px',
              height: '40px',
              border: '1px solid var(--border)',
              borderRadius: '0.5rem',
              cursor: 'pointer'
            }}
          />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
            Cor de Fundo
          </label>
          <input
            type="color"
            value={backgroundColor}
            onChange={(e) => setBackgroundColor(e.target.value)}
            style={{
              width: '100px',
              height: '40px',
              border: '1px solid var(--border)',
              borderRadius: '0.5rem',
              cursor: 'pointer'
            }}
          />
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
        <button
          onClick={generateQrCode}
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
          Gerar QR Code
        </button>
        <button
          onClick={downloadPng}
          disabled={!qrCodeUrl}
          style={{
            padding: '0.75rem 1.5rem',
            background: qrCodeUrl 
              ? 'linear-gradient(135deg, var(--success), #059669)' 
              : 'rgba(139, 92, 246, 0.1)',
            color: qrCodeUrl ? 'white' : 'var(--muted-foreground)',
            border: qrCodeUrl ? 'none' : '1px solid var(--card-border)',
            borderRadius: '0.5rem',
            cursor: qrCodeUrl ? 'pointer' : 'not-allowed',
            fontWeight: '500',
            transition: 'all 0.3s ease',
            boxShadow: qrCodeUrl ? '0 4px 15px rgba(16, 185, 129, 0.4)' : 'none'
          }}
          onMouseEnter={(e) => {
            if (qrCodeUrl) {
              e.currentTarget.style.transform = 'translateY(-2px)'
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(16, 185, 129, 0.6)'
            }
          }}
          onMouseLeave={(e) => {
            if (qrCodeUrl) {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = '0 4px 15px rgba(16, 185, 129, 0.4)'
            }
          }}
        >
          Baixar PNG
        </button>
      </div>

      {/* QR Code display */}
      {qrCodeUrl && (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '2rem',
          background: 'var(--muted)',
          borderRadius: '0.5rem',
          border: '1px solid var(--border)'
        }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={qrCodeUrl}
            alt="QR Code"
            style={{
              maxWidth: '100%',
              height: 'auto',
              borderRadius: '0.5rem'
            }}
          />
        </div>
      )}
    </div>
  )
}

