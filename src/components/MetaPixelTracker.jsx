import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

export default function MetaPixelTracker() {
  const { pathname } = useLocation()

  useEffect(() => {
    if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
      window.fbq('track', 'PageView')
    }
  }, [pathname])

  return null
}
