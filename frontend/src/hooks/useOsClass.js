// src/hooks/useOsClass.js
import { useEffect } from 'react'

export function useOsClass() {
  useEffect(() => {
    const ua = navigator.userAgent || navigator.vendor || window.opera
    if (/iPad|iPhone|iPod/.test(ua)) {
      document.body.classList.add('is-ios')
    } else if (navigator.platform.toUpperCase().includes('MAC')) {
      document.body.classList.add('is-macos')
    }
  }, [])
}
