// src/hooks/useViewportHeight.js
import { useEffect } from 'react'

export function useViewportHeight() {
  useEffect(() => {
    // Set --vh CSS var so we can handle mobile viewport sizing
    const updateVh = () => {
      document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`)
    }
    window.addEventListener('resize', updateVh, { passive: true })
    window.addEventListener('scroll', updateVh, { passive: true })
    window.addEventListener('orientationchange', updateVh)
    updateVh()

    return () => {
      window.removeEventListener('resize', updateVh)
      window.removeEventListener('scroll', updateVh)
      window.removeEventListener('orientationchange', updateVh)
    }
  }, [])
}
