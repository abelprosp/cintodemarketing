interface AdPlaceholderProps {
  position: 'top' | 'sidebar' | 'bottom'
  className?: string
}

export function AdPlaceholder({ position, className }: AdPlaceholderProps) {
  const getStyles = () => {
    switch (position) {
      case 'top':
        return {
          width: '100%',
          height: '100px',
          margin: '1rem 0',
        }
      case 'sidebar':
        return {
          width: '300px',
          height: '250px',
          minHeight: '250px',
        }
      case 'bottom':
        return {
          width: '100%',
          height: '100px',
          margin: '1rem 0',
        }
      default:
        return {}
    }
  }

  return (
    <div
      className={className}
      style={{
        ...getStyles(),
        background: 'rgba(26, 26, 36, 0.4)',
        border: '2px dashed var(--card-border)',
        borderRadius: '0.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--muted-foreground)',
        fontSize: '0.875rem',
        textAlign: 'center',
        padding: '1rem',
        boxShadow: '0 0 10px rgba(139, 92, 246, 0.1)',
        backdropFilter: 'blur(5px)'
      }}
    >
      <div>
        <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>📢</div>
        <div>Espaço para Anúncio</div>
        <div style={{ fontSize: '0.75rem', marginTop: '0.25rem' }}>
          {position === 'top' && '728x90 ou 970x250'}
          {position === 'sidebar' && '300x250'}
          {position === 'bottom' && '728x90'}
        </div>
      </div>
    </div>
  )
}

