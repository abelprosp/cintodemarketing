'use client'

import { useState } from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus, vs } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { useTheme } from '../ThemeProvider'

export function JsonToToonConverter() {
  const { theme } = useTheme()
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')
  const [delimiter, setDelimiter] = useState(',')
  const [compactMode, setCompactMode] = useState(true)
  const [tokenCount, setTokenCount] = useState({ json: 0, toon: 0, reduction: 0 })

  // Improved token counter (closer to actual LLM tokenization)
  const countTokens = (text: string): number => {
    // More accurate estimation: 
    // - Split by whitespace
    // - Count punctuation as separate tokens
    // - Count words (approximate 1 token per 4 characters for common words)
    const words = text.split(/\s+/).filter(w => w.length > 0)
    let tokens = 0
    
    words.forEach(word => {
      // Remove punctuation for word count
      const cleanWord = word.replace(/[,:{}[\]"()]/g, '')
      if (cleanWord.length > 0) {
        // Approximate: 1 token per 4 characters (for common words)
        tokens += Math.ceil(cleanWord.length / 4) || 1
      }
      // Count punctuation as separate tokens
      const punctuation = word.match(/[,:{}[\]"()]/g)
      if (punctuation) {
        tokens += punctuation.length
      }
    })
    
    // Add tokens for special characters and structure
    tokens += (text.match(/[{}[\]]/g) || []).length
    tokens += Math.ceil((text.match(/\n/g) || []).length / 2) // Newlines count less
    
    return Math.max(1, tokens)
  }

  const escapeValue = (value: any, compact: boolean = false): string => {
    if (value === null) return compact ? '' : 'null'
    if (value === undefined) return ''
    if (typeof value === 'string') {
      // If contains delimiter, wrap in quotes or use different delimiter
      if (value.includes(delimiter) || value.includes('\n')) {
        return `"${value.replace(/"/g, '\\"')}"`
      }
      return value
    }
    if (typeof value === 'boolean') {
      return compact ? (value ? '1' : '0') : String(value) // Use 1/0 in compact mode
    }
    return String(value)
  }

  const isArrayOfObjects = (arr: any[]): boolean => {
    if (arr.length === 0) return false
    return arr.every(item => typeof item === 'object' && item !== null && !Array.isArray(item))
  }

  const getObjectKeys = (arr: any[]): string[] => {
    if (arr.length === 0) return []
    const allKeys = new Set<string>()
    arr.forEach(item => {
      if (typeof item === 'object' && item !== null) {
        Object.keys(item).forEach(key => allKeys.add(key))
      }
    })
    return Array.from(allKeys)
  }

  const areObjectsUniform = (arr: any[]): boolean => {
    if (arr.length === 0) return true
    const firstKeys = Object.keys(arr[0] || {})
    return arr.every(item => {
      const itemKeys = Object.keys(item || {})
      return itemKeys.length === firstKeys.length && 
             itemKeys.every(key => firstKeys.includes(key))
    })
  }

  const convertValue = (value: any, indent: number = 0, keyName: string = ''): string => {
    const indentStr = compactMode ? '' : '  '.repeat(indent)
    // Always use newlines but minimize spaces in compact mode
    const newline = '\n'
    const space = compactMode ? '' : ' '
    
    if (value === null) return compactMode ? '' : 'null'
    if (value === undefined) return ''
    
    if (Array.isArray(value)) {
      // Check if it's an array of uniform objects (tabular format)
      if (isArrayOfObjects(value) && areObjectsUniform(value) && value.length > 0) {
        const keys = getObjectKeys(value)
        if (keys.length > 0) {
          const indentData = compactMode ? '' : indentStr + '  '
          let result = `${indentStr}[${value.length}]{${keys.join(',')}}:${newline}`
          value.forEach((item: any) => {
            const values = keys.map(key => {
              const val = item[key]
              if (val === null || val === undefined) return compactMode ? '' : 'null'
              return escapeValue(val, compactMode)
            }).filter(v => !compactMode || v !== '')
            if (values.length > 0 || !compactMode) {
              result += `${indentData}${values.join(delimiter)}${newline}`
            }
          })
          return result.trimEnd()
        }
      }
      
      // Check if it's an array of primitives - keep compact but with line breaks
      if (compactMode && value.length > 0 && value.every(item => 
        typeof item !== 'object' || item === null
      )) {
        const values = value.map(item => escapeValue(item, true)).join(delimiter)
        // Split long arrays into multiple lines if too long
        if (values.length > 80) {
          const chunks: string[] = []
          let currentChunk: string[] = []
          let currentLength = 0
          value.forEach((item: any) => {
            const val = escapeValue(item, true)
            if (currentLength + val.length > 80 && currentChunk.length > 0) {
              chunks.push(currentChunk.join(delimiter))
              currentChunk = [val]
              currentLength = val.length
            } else {
              currentChunk.push(val)
              currentLength += val.length + delimiter.length
            }
          })
          if (currentChunk.length > 0) {
            chunks.push(currentChunk.join(delimiter))
          }
          return `[${chunks.join(newline + indentStr)}]`
        }
        return `[${values}]`
      }
      
      // Regular array
      if (value.length === 0) return '[]'
      let result = `${indentStr}[${newline}`
      value.forEach((item: any, index: number) => {
        const converted = convertValue(item, indent + 1, '')
        if (index < value.length - 1) {
          result += `${converted},${newline}`
        } else {
          result += `${converted}${newline}`
        }
      })
      result += `${indentStr}]`
      return result
    }
    
    if (typeof value === 'object' && value !== null) {
      // Check if it's a simple object that can be inlined (but still break lines)
      const entries = Object.entries(value)
      if (compactMode && entries.length <= 3 && entries.every(([_, val]) => 
        typeof val !== 'object' || val === null || Array.isArray(val)
      )) {
        const pairs = entries.map(([k, v]) => {
          const escaped = escapeValue(v, true)
          return escaped !== '' ? `${k}:${escaped}` : null
        }).filter(Boolean)
        const inline = pairs.join(',')
        // Break line if too long
        if (inline.length > 100) {
          return `{${newline}${indentStr}  ${pairs.join(',' + newline + indentStr + '  ')}${newline}${indentStr}}`
        }
        return `{${inline}}`
      }
      
      let result = `${indentStr}:${newline}`
      entries.forEach(([key, val]) => {
        if (Array.isArray(val) && isArrayOfObjects(val) && areObjectsUniform(val) && val.length > 0) {
          // Tabular format for arrays of objects
          const keys = getObjectKeys(val)
          if (keys.length > 0) {
            const indentData = compactMode ? '' : indentStr + '  '
            result += `${indentStr}${compactMode ? '' : '  '}${key}[${val.length}]{${keys.join(',')}}:${newline}`
            val.forEach((item: any) => {
              const values = keys.map(k => {
                const v = item[k]
                if (v === null || v === undefined) return compactMode ? '' : 'null'
                return escapeValue(v, compactMode)
              }).filter(v => !compactMode || v !== '')
              if (values.length > 0 || !compactMode) {
                result += `${indentData}${values.join(delimiter)}${newline}`
              }
            })
          } else {
            const converted = convertValue(val, indent + 1, key)
            result += `${indentStr}${compactMode ? '' : '  '}${key}${converted}${newline}`
          }
        } else {
          const converted = convertValue(val, indent + 1, key)
          if (converted.includes('\n') || converted.startsWith('[') || converted.startsWith(':')) {
            result += `${indentStr}${compactMode ? '' : '  '}${key}${converted}${newline}`
          } else {
            result += `${indentStr}${compactMode ? '' : '  '}${key}:${space}${converted}${newline}`
          }
        }
      })
      return result.trimEnd()
    }
    
    return escapeValue(value, compactMode)
  }

  const convertToToon = (obj: any): string => {
    const newline = '\n' // Always use newlines
    const space = compactMode ? '' : ' '
    
    if (Array.isArray(obj)) {
      // Root level array
      if (isArrayOfObjects(obj) && areObjectsUniform(obj) && obj.length > 0) {
        const keys = getObjectKeys(obj)
        if (keys.length > 0) {
          const indentData = compactMode ? '' : '  '
          let result = `[${obj.length}]{${keys.join(',')}}:${newline}`
          obj.forEach((item: any) => {
            const values = keys.map(key => {
              const val = item[key]
              if (val === null || val === undefined) return compactMode ? '' : 'null'
              return escapeValue(val, compactMode)
            }).filter(v => !compactMode || v !== '')
            if (values.length > 0 || !compactMode) {
              result += `${indentData}${values.join(delimiter)}${newline}`
            }
          })
          return result.trimEnd()
        }
      }
      return convertValue(obj, 0)
    }
    
    if (typeof obj === 'object' && obj !== null) {
      let result = ''
      const entries = Object.entries(obj)
      
      entries.forEach(([key, value]) => {
        if (Array.isArray(value) && isArrayOfObjects(value) && areObjectsUniform(value) && value.length > 0) {
          // Tabular format
          const keys = getObjectKeys(value)
          if (keys.length > 0) {
            const indentData = compactMode ? '' : '  '
            result += `${key}[${value.length}]{${keys.join(',')}}:${newline}`
            value.forEach((item: any) => {
              const values = keys.map(k => {
                const v = item[k]
                if (v === null || v === undefined) return compactMode ? '' : 'null'
                return escapeValue(v, compactMode)
              }).filter(v => !compactMode || v !== '')
              if (values.length > 0 || !compactMode) {
                result += `${indentData}${values.join(delimiter)}${newline}`
              }
            })
          } else {
            const converted = convertValue(value, 0, key)
            result += `${key}${converted}${newline}`
          }
        } else {
          const converted = convertValue(value, 0, key)
          if (converted.includes('\n') || converted.startsWith('[') || converted.startsWith(':')) {
            result += `${key}${converted}${newline}`
          } else {
            result += `${key}:${space}${converted}${newline}`
          }
        }
      })
      return result.trimEnd()
    }
    
    return String(obj)
  }

  const convert = () => {
    try {
      setError('')
      const parsed = JSON.parse(input)
      
      const jsonString = JSON.stringify(parsed, null, 2)
      const toonString = convertToToon(parsed)
      
      const jsonTokens = countTokens(jsonString)
      const toonTokens = countTokens(toonString)
      const reduction = jsonTokens > 0 
        ? Math.round(((jsonTokens - toonTokens) / jsonTokens) * 100) 
        : 0
      
      setTokenCount({
        json: jsonTokens,
        toon: toonTokens,
        reduction
      })
      
      setOutput(toonString)
    } catch (err) {
      setError('JSON inválido. Verifique a sintaxe.')
      setOutput('')
      setTokenCount({ json: 0, toon: 0, reduction: 0 })
    }
  }

  const copyToClipboard = () => {
    if (output) {
      navigator.clipboard.writeText(output)
      alert('TOON copiado para a área de transferência!')
    }
  }

  const clearAll = () => {
    setInput('')
    setOutput('')
    setError('')
    setTokenCount({ json: 0, toon: 0, reduction: 0 })
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
        JSON to TOON Converter
      </h2>
      <p style={{ 
        marginBottom: '1.5rem', 
        color: 'var(--muted-foreground)',
        fontSize: '0.875rem',
        lineHeight: '1.5'
      }}>
        Converta JSON para TOON (Token-Oriented Object Notation) - um formato compacto otimizado para LLMs que reduz tokens em 30-60%.
      </p>

      <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <div style={{ flex: '1', minWidth: '200px' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
            Delimitador (para arrays tabulares)
          </label>
          <select
            value={delimiter}
            onChange={(e) => setDelimiter(e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid var(--card-border)',
              borderRadius: '0.5rem',
              background: 'rgba(37, 37, 53, 0.5)',
              color: 'var(--foreground)',
              fontSize: '1rem'
            }}
          >
            <option value=",">Vírgula (,)</option>
            <option value="|">Pipe (|)</option>
            <option value="\t">Tab</option>
          </select>
          <div style={{ marginTop: '0.25rem', fontSize: '0.75rem', color: 'var(--muted-foreground)' }}>
            Use pipe ou tab se seus dados contiverem vírgulas
          </div>
        </div>
        <div style={{ flex: '1', minWidth: '200px' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
            Modo de Compactação
          </label>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.75rem',
            background: 'rgba(37, 37, 53, 0.5)',
            border: '1px solid var(--card-border)',
            borderRadius: '0.5rem'
          }}>
            <input
              type="checkbox"
              checked={compactMode}
              onChange={(e) => setCompactMode(e.target.checked)}
              style={{
                width: '20px',
                height: '20px',
                cursor: 'pointer',
                accentColor: 'var(--primary)'
              }}
            />
            <span style={{ fontSize: '0.875rem', color: 'var(--foreground)' }}>
              Modo Ultra-Compacto
            </span>
          </div>
          <div style={{ marginTop: '0.25rem', fontSize: '0.75rem', color: 'var(--muted-foreground)' }}>
            Remove espaços desnecessários e valores null, mantendo quebras de linha para legibilidade
          </div>
        </div>
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
          Cole seu JSON aqui
        </label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder='{"users": [{"id": 1, "name": "Alice", "role": "admin"}, {"id": 2, "name": "Bob", "role": "user"}]}'
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
          onClick={convert}
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
          Converter para TOON
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
          Copiar TOON
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

      {tokenCount.json > 0 && (
        <div style={{
          padding: '1rem',
          background: 'rgba(139, 92, 246, 0.1)',
          border: '1px solid var(--card-border)',
          borderRadius: '0.5rem',
          marginBottom: '1.5rem',
          display: 'flex',
          gap: '2rem',
          flexWrap: 'wrap',
          alignItems: 'center'
        }}>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)', marginBottom: '0.25rem' }}>
              Tokens JSON
            </div>
            <div style={{ fontSize: '1.25rem', fontWeight: '600', color: 'var(--foreground)' }}>
              {tokenCount.json}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)', marginBottom: '0.25rem' }}>
              Tokens TOON
            </div>
            <div style={{ fontSize: '1.25rem', fontWeight: '600', color: 'var(--foreground)' }}>
              {tokenCount.toon}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)', marginBottom: '0.25rem' }}>
              Redução
            </div>
            <div style={{ 
              fontSize: '1.25rem', 
              fontWeight: '600', 
              color: 'var(--success)'
            }}>
              {tokenCount.reduction}%
            </div>
          </div>
        </div>
      )}

      {output && (
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
            TOON Formatado
          </label>
          <div style={{
            border: '1px solid var(--card-border)',
            borderRadius: '0.5rem',
            overflow: 'auto',
            maxHeight: '500px',
            background: 'rgba(37, 37, 53, 0.5)'
          }}>
            <SyntaxHighlighter
              language="yaml"
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

