'use client'

interface ToolTabsProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

const tabs = [
  { id: 'json', label: 'Formatador JSON/XML', icon: '📝' },
  { id: 'qrcode', label: 'Gerador QR Code', icon: '🔲' },
  { id: 'whatsapp', label: 'Link WhatsApp', icon: '💬' },
  { id: 'jsontoon', label: 'JSON to TOON', icon: '🔧' },
]

export function ToolTabs({ activeTab, onTabChange }: ToolTabsProps) {
  return (
    <div style={{
      display: 'flex',
      gap: '0.5rem',
      marginBottom: '2rem',
      flexWrap: 'wrap',
      borderBottom: '2px solid var(--border)',
      paddingBottom: '0.5rem'
    }}>
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          style={{
            padding: '0.75rem 1.5rem',
            background: activeTab === tab.id 
              ? 'linear-gradient(135deg, var(--primary), var(--secondary))' 
              : 'transparent',
            color: activeTab === tab.id ? 'white' : 'var(--foreground)',
            border: 'none',
            borderRadius: '0.5rem 0.5rem 0 0',
            cursor: 'pointer',
            fontSize: '0.875rem',
            fontWeight: activeTab === tab.id ? '600' : '400',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            transition: 'all 0.3s ease',
            borderBottom: activeTab === tab.id ? '2px solid var(--primary-glow)' : '2px solid transparent',
            marginBottom: activeTab === tab.id ? '-2px' : '0',
            boxShadow: activeTab === tab.id ? '0 0 15px var(--purple-glow)' : 'none',
            position: 'relative',
            overflow: 'hidden'
          }}
          onMouseEnter={(e) => {
            if (activeTab !== tab.id) {
              e.currentTarget.style.background = 'rgba(139, 92, 246, 0.1)'
              e.currentTarget.style.boxShadow = '0 0 10px rgba(139, 92, 246, 0.3)'
            } else {
              e.currentTarget.style.boxShadow = '0 0 20px var(--purple-glow), 0 0 30px var(--blue-glow)'
            }
          }}
          onMouseLeave={(e) => {
            if (activeTab !== tab.id) {
              e.currentTarget.style.background = 'transparent'
              e.currentTarget.style.boxShadow = 'none'
            } else {
              e.currentTarget.style.boxShadow = '0 0 15px var(--purple-glow)'
            }
          }}
        >
          <span>{tab.icon}</span>
          <span>{tab.label}</span>
        </button>
      ))}
    </div>
  )
}

