'use client'

import { GoogleAd } from './GoogleAd'

interface AdPlaceholderProps {
  position: 'top' | 'sidebar' | 'bottom'
  className?: string
}

export function AdPlaceholder({ position, className }: AdPlaceholderProps) {
  // Use Google Ads component
  return <GoogleAd position={position} className={className} />
}

