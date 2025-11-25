'use client'

import { useState } from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus, vs } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { useTheme } from '../ThemeProvider'

export function JsonFormatter() {
  const { theme } = useTheme()
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')
  const [formatType, setFormatType] = useState<'json' | 'xml'>('json')

  const formatJson = () => {
    try {
      setError('')
      const parsed = JSON.parse(input)
      const formatted = JSON.stringify(parsed, null, 2)
      setOutput(formatted)
      setFormatType('json')
    } catch (err) {
      setError('JSON inválido. Verifique a sintaxe.')
      setOutput('')
    }
  }

  const formatXml = () => {
    try {
      setError('')
      // Simple XML formatting
      let formatted = input.replace(/>\s*</g, '>\n<')
      const lines = formatted.split('\n')
      let indent = 0
      const indentSize = 2
      
      formatted = lines.map(line => {
        const trimmed = line.trim()
        if (!trimmed) return ''
        
        if (trimmed.startsWith('</')) {
          indent--
        }
        
        const indented = ' '.repeat(Math.max(0, indent * indentSize)) + trimmed
        
        if (trimmed.startsWith('<') && !trimmed.startsWith('</') && !trimmed.endsWith('/>')) {
          indent++
        }
        
        return indented
      }).filter(line => line).join('\n')
      
      setOutput(formatted)
      setFormatType('xml')
    } catch (err) {
      setError('Erro ao formatar XML.')
      setOutput('')
    }
  }

  const minify = () => {
    try {
      setError('')
      if (formatType === 'json') {
        const parsed = JSON.parse(input)
        const minified = JSON.stringify(parsed)
        setOutput(minified)
      } else {
        const minified = input.replace(/>\s*</g, '><').trim()
        setOutput(minified)
      }
    } catch (err) {
      setError('Erro ao minificar.')
      setOutput('')
    }
  }

  const copyToClipboard = () => {
    if (output) {
      navigator.clipboard.writeText(output)
      alert('Copiado para a área de transferência!')
    }
  }

  const clearAll = () => {
    setInput('')
    setOutput('')
    setError('')
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
        Formatador e Validador JSON/XML
      </h2>

      <div style={{ marginBottom: '1rem' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
          Cole seu código aqui
        </label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder='{"exemplo": "valor"} ou <xml>...</xml>'
          style={{
            width: '100%',
            minHeight: '200px',
            padding: '1rem',
            border: '1px solid var(--card-border)',
            borderRadius: '0.5rem',
            background: 'rgba(37, 37, 53, 0.5)',
            color: 'var(--foreground)',
            fontFamily: 'monospace',
            fontSize: '0.875rem',
            resize: 'vertical',
            transition: 'all 0.3s ease',
            boxShadow: '0 0 0 1px rgba(139, 92, 246, 0.1)'
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = 'var(--primary-glow)'
            e.currentTarget.style.boxShadow = '0 0 0 2px rgba(139, 92, 246, 0.2), 0 0 15px rgba(139, 92, 246, 0.1)'
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = 'var(--card-border)'
            e.currentTarget.style.boxShadow = '0 0 0 1px rgba(139, 92, 246, 0.1)'
          }}
        />
        <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: 'var(--muted-foreground)' }}>
          {input.length} caracteres
        </div>
      </div>

      {error && (
        <div style={{
          padding: '0.75rem',
          background: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid var(--error)',
          borderRadius: '0.5rem',
          color: 'var(--error)',
          marginBottom: '1rem'
        }}>
          {error}
        </div>
      )}

      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
        <button
          onClick={formatJson}
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
          Formatar JSON
        </button>
        <button
          onClick={formatXml}
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
          Formatar XML
        </button>
        <button
          onClick={minify}
          style={{
            padding: '0.75rem 1.5rem',
            background: 'rgba(99, 102, 241, 0.2)',
            color: 'var(--secondary-glow)',
            border: '1px solid var(--card-border)',
            borderRadius: '0.5rem',
            cursor: 'pointer',
            fontWeight: '500',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(99, 102, 241, 0.3)'
            e.currentTarget.style.boxShadow = '0 0 15px rgba(99, 102, 241, 0.4)'
            e.currentTarget.style.transform = 'translateY(-2px)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(99, 102, 241, 0.2)'
            e.currentTarget.style.boxShadow = 'none'
            e.currentTarget.style.transform = 'translateY(0)'
          }}
        >
          Minificar
        </button>
        <button
          onClick={copyToClipboard}
          disabled={!output}
          style={{
            padding: '0.75rem 1.5rem',
            background: output 
              ? 'linear-gradient(135deg, var(--success), #059669)' 
              : 'rgba(139, 92, 246, 0.1)',
            color: output ? 'white' : 'var(--muted-foreground)',
            border: output ? 'none' : '1px solid var(--card-border)',
            borderRadius: '0.5rem',
            cursor: output ? 'pointer' : 'not-allowed',
            fontWeight: '500',
            transition: 'all 0.3s ease',
            boxShadow: output ? '0 4px 15px rgba(16, 185, 129, 0.4)' : 'none'
          }}
          onMouseEnter={(e) => {
            if (output) {
              e.currentTarget.style.transform = 'translateY(-2px)'
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(16, 185, 129, 0.6)'
            }
          }}
          onMouseLeave={(e) => {
            if (output) {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = '0 4px 15px rgba(16, 185, 129, 0.4)'
            }
          }}
        >
          Copiar
        </button>
        <button
          onClick={clearAll}
          style={{
            padding: '0.75rem 1.5rem',
            background: 'rgba(139, 92, 246, 0.1)',
            color: 'var(--foreground)',
            border: '1px solid var(--card-border)',
            borderRadius: '0.5rem',
            cursor: 'pointer',
            fontWeight: '500',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(139, 92, 246, 0.2)'
            e.currentTarget.style.boxShadow = '0 0 10px rgba(139, 92, 246, 0.3)'
            e.currentTarget.style.transform = 'translateY(-2px)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(139, 92, 246, 0.1)'
            e.currentTarget.style.boxShadow = 'none'
            e.currentTarget.style.transform = 'translateY(0)'
          }}
        >
          Limpar
        </button>
      </div>

      {output && (
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
            Resultado Formatado
          </label>
          <div style={{
            border: '1px solid var(--border)',
            borderRadius: '0.5rem',
            overflow: 'auto',
            maxHeight: '500px',
            background: 'var(--input)'
          }}>
            <SyntaxHighlighter
              language={formatType}
              style={theme === 'dark' ? vscDarkPlus : vs}
              customStyle={{ margin: 0, padding: '1rem' }}
              showLineNumbers
            >
              {output}
            </SyntaxHighlighter>
          </div>
        </div>
      )}
    </div>
  )
}

