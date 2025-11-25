'use client'

import { useState } from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus, vs } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { useTheme } from '../ThemeProvider'

type OutputType = 'typescript-interface' | 'typescript-type' | 'python-class' | 'java-class' | 'csharp-class' | 'go-struct' | 'swift-struct'

export function JsonToTypeConverter() {
  const { theme } = useTheme()
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')
  const [outputType, setOutputType] = useState<OutputType>('typescript-interface')
  const [rootName, setRootName] = useState('Root')

  const toCamelCase = (str: string): string => {
    return str.replace(/(?:^|[-_\s])(\w)/g, (_, c) => c ? c.toUpperCase() : '')
      .replace(/[-_\s]/g, '')
  }

  const toPascalCase = (str: string): string => {
    const camel = toCamelCase(str)
    return camel.charAt(0).toUpperCase() + camel.slice(1)
  }

  const toSnakeCase = (str: string): string => {
    return str.replace(/([A-Z])/g, '_$1').toLowerCase().replace(/^_/, '')
  }

  const getTypeScriptType = (value: any, key: string = ''): string => {
    if (value === null) return 'null'
    if (Array.isArray(value)) {
      if (value.length === 0) return 'any[]'
      const itemType = getTypeScriptType(value[0], key)
      return `${itemType}[]`
    }
    if (typeof value === 'object') {
      return toPascalCase(key || 'Object')
    }
    if (typeof value === 'string') return 'string'
    if (typeof value === 'number') return 'number'
    if (typeof value === 'boolean') return 'boolean'
    return 'any'
  }

  const convertToTypeScriptInterface = (obj: any, name: string = 'Root'): string => {
    let result = `interface ${toPascalCase(name)} {\n`
    
    for (const [key, value] of Object.entries(obj)) {
      const propName = toCamelCase(key)
      const type = getTypeScriptType(value, key)
      const optional = value === null || value === undefined ? '?' : ''
      result += `  ${propName}${optional}: ${type};\n`
    }
    
    result += '}'
    return result
  }

  const convertToTypeScriptType = (obj: any, name: string = 'Root'): string => {
    let result = `type ${toPascalCase(name)} = {\n`
    
    for (const [key, value] of Object.entries(obj)) {
      const propName = toCamelCase(key)
      const type = getTypeScriptType(value, key)
      const optional = value === null || value === undefined ? '?' : ''
      result += `  ${propName}${optional}: ${type};\n`
    }
    
    result += '}'
    return result
  }

  const convertToPythonClass = (obj: any, name: string = 'Root'): string => {
    let result = `class ${toPascalCase(name)}:\n`
    result += `    def __init__(self):\n`
    
    for (const [key, value] of Object.entries(obj)) {
      const propName = toSnakeCase(key)
      const defaultValue = value === null ? 'None' : 
                          typeof value === 'string' ? `""` :
                          typeof value === 'number' ? '0' :
                          typeof value === 'boolean' ? 'False' :
                          Array.isArray(value) ? '[]' : 'None'
      result += `        self.${propName} = ${defaultValue}\n`
    }
    
    return result
  }

  const convertToJavaClass = (obj: any, name: string = 'Root'): string => {
    let result = `public class ${toPascalCase(name)} {\n`
    
    for (const [key, value] of Object.entries(obj)) {
      const propName = toCamelCase(key)
      let javaType = 'Object'
      if (typeof value === 'string') javaType = 'String'
      else if (typeof value === 'number') javaType = Number.isInteger(value) ? 'Integer' : 'Double'
      else if (typeof value === 'boolean') javaType = 'Boolean'
      else if (Array.isArray(value)) javaType = 'List<Object>'
      
      result += `    private ${javaType} ${propName};\n`
    }
    
    result += '\n    // Getters and Setters\n'
    for (const [key, value] of Object.entries(obj)) {
      const propName = toCamelCase(key)
      const methodName = toPascalCase(key)
      let javaType = 'Object'
      if (typeof value === 'string') javaType = 'String'
      else if (typeof value === 'number') javaType = Number.isInteger(value) ? 'Integer' : 'Double'
      else if (typeof value === 'boolean') javaType = 'Boolean'
      else if (Array.isArray(value)) javaType = 'List<Object>'
      result += `    public ${javaType} get${methodName}() { return ${propName}; }\n`
      result += `    public void set${methodName}(${javaType} ${propName}) { this.${propName} = ${propName}; }\n`
    }
    
    result += '}'
    return result
  }

  const convertToCSharpClass = (obj: any, name: string = 'Root'): string => {
    let result = `public class ${toPascalCase(name)}\n{\n`
    
    for (const [key, value] of Object.entries(obj)) {
      const propName = toPascalCase(key)
      let csharpType = 'object'
      if (typeof value === 'string') csharpType = 'string'
      else if (typeof value === 'number') csharpType = Number.isInteger(value) ? 'int' : 'double'
      else if (typeof value === 'boolean') csharpType = 'bool'
      else if (Array.isArray(value)) csharpType = 'List<object>'
      
      result += `    public ${csharpType} ${propName} { get; set; }\n`
    }
    
    result += '}'
    return result
  }

  const convertToGoStruct = (obj: any, name: string = 'Root'): string => {
    let result = `type ${toPascalCase(name)} struct {\n`
    
    for (const [key, value] of Object.entries(obj)) {
      const propName = toPascalCase(key)
      let goType = 'interface{}'
      if (typeof value === 'string') goType = 'string'
      else if (typeof value === 'number') goType = Number.isInteger(value) ? 'int' : 'float64'
      else if (typeof value === 'boolean') goType = 'bool'
      else if (Array.isArray(value)) goType = '[]interface{}'
      
      result += `    ${propName} ${goType} \`json:"${key}"\`\n`
    }
    
    result += '}'
    return result
  }

  const convertToSwiftStruct = (obj: any, name: string = 'Root'): string => {
    let result = `struct ${toPascalCase(name)}: Codable {\n`
    
    for (const [key, value] of Object.entries(obj)) {
      const propName = toCamelCase(key)
      let swiftType = 'Any'
      if (typeof value === 'string') swiftType = 'String'
      else if (typeof value === 'number') swiftType = Number.isInteger(value) ? 'Int' : 'Double'
      else if (typeof value === 'boolean') swiftType = 'Bool'
      else if (Array.isArray(value)) swiftType = '[Any]'
      
      result += `    let ${propName}: ${swiftType}\n`
    }
    
    result += '}'
    return result
  }

  const convert = () => {
    try {
      setError('')
      const parsed = JSON.parse(input)
      
      if (typeof parsed !== 'object' || Array.isArray(parsed)) {
        setError('Por favor, insira um objeto JSON válido (não um array)')
        setOutput('')
        return
      }

      let converted = ''
      switch (outputType) {
        case 'typescript-interface':
          converted = convertToTypeScriptInterface(parsed, rootName)
          break
        case 'typescript-type':
          converted = convertToTypeScriptType(parsed, rootName)
          break
        case 'python-class':
          converted = convertToPythonClass(parsed, rootName)
          break
        case 'java-class':
          converted = convertToJavaClass(parsed, rootName)
          break
        case 'csharp-class':
          converted = convertToCSharpClass(parsed, rootName)
          break
        case 'go-struct':
          converted = convertToGoStruct(parsed, rootName)
          break
        case 'swift-struct':
          converted = convertToSwiftStruct(parsed, rootName)
          break
      }
      
      setOutput(converted)
    } catch (err) {
      setError('JSON inválido. Verifique a sintaxe.')
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

  const getLanguage = (): string => {
    switch (outputType) {
      case 'typescript-interface':
      case 'typescript-type':
        return 'typescript'
      case 'python-class':
        return 'python'
      case 'java-class':
        return 'java'
      case 'csharp-class':
        return 'csharp'
      case 'go-struct':
        return 'go'
      case 'swift-struct':
        return 'swift'
      default:
        return 'typescript'
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
        JSON to Type Converter
      </h2>

      <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <div style={{ flex: '1', minWidth: '200px' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
            Tipo de Saída
          </label>
          <select
            value={outputType}
            onChange={(e) => setOutputType(e.target.value as OutputType)}
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
            <option value="typescript-interface">TypeScript Interface</option>
            <option value="typescript-type">TypeScript Type</option>
            <option value="python-class">Python Class</option>
            <option value="java-class">Java Class</option>
            <option value="csharp-class">C# Class</option>
            <option value="go-struct">Go Struct</option>
            <option value="swift-struct">Swift Struct</option>
          </select>
        </div>
        <div style={{ flex: '1', minWidth: '200px' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
            Nome da Classe/Interface
          </label>
          <input
            type="text"
            value={rootName}
            onChange={(e) => setRootName(e.target.value)}
            placeholder="Root"
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid var(--card-border)',
              borderRadius: '0.5rem',
              background: 'rgba(37, 37, 53, 0.5)',
              color: 'var(--foreground)',
              fontSize: '1rem'
            }}
          />
        </div>
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
          Cole seu JSON aqui
        </label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder='{"nome": "João", "idade": 30, "ativo": true}'
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
          Converter
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
            Código Gerado
          </label>
          <div style={{
            border: '1px solid var(--card-border)',
            borderRadius: '0.5rem',
            overflow: 'auto',
            maxHeight: '500px',
            background: 'rgba(37, 37, 53, 0.5)'
          }}>
            <SyntaxHighlighter
              language={getLanguage()}
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

