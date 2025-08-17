'use client'

import { createContext, useContext, useEffect, ReactNode } from 'react'
import { initializeAnalytics } from '@/lib/analytics'

interface AnalyticsContextType {
  isInitialized: boolean
}

const AnalyticsContext = createContext<AnalyticsContextType>({
  isInitialized: false,
})

interface AnalyticsProviderProps {
  children: ReactNode
}

export function AnalyticsProvider({ children }: AnalyticsProviderProps) {
  useEffect(() => {
    // Initialize analytics when the provider mounts
    initializeAnalytics()
  }, [])

  return (
    <AnalyticsContext.Provider value={{ isInitialized: true }}>
      {children}
    </AnalyticsContext.Provider>
  )
}

export function useAnalyticsContext() {
  return useContext(AnalyticsContext)
}

// Google Analytics Script Component
interface GoogleAnalyticsProps {
  measurementId: string
}

export function GoogleAnalytics({ measurementId }: GoogleAnalyticsProps) {
  useEffect(() => {
    // Only load if we're in the browser and measurement ID is provided
    if (typeof window === 'undefined' || !measurementId) return

    // Create and append the gtag script
    const gtagScript = document.createElement('script')
    gtagScript.async = true
    gtagScript.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`
    document.head.appendChild(gtagScript)

    // Initialize gtag
    window.dataLayer = window.dataLayer || []
    function gtag(...args: any[]) {
      window.dataLayer.push(args)
    }
    window.gtag = gtag
    
    // Store measurement ID for other components to use
    ;(window as any).GA_MEASUREMENT_ID = measurementId

    gtag('js', new Date())
    gtag('config', measurementId, {
      // Respect user privacy settings
      anonymize_ip: true,
      // Don't send personal data
      allow_google_signals: false,
      // Custom configuration for marketing site
      custom_map: {
        dimension1: 'persona',
        dimension2: 'magnet_type',
      }
    })

    return () => {
      // Cleanup: remove the script when component unmounts
      const scripts = document.querySelectorAll(`script[src*="${measurementId}"]`)
      scripts.forEach(script => script.remove())
    }
  }, [measurementId])

  return null
}

// Extend Window interface for Google Analytics
declare global {
  interface Window {
    dataLayer: any[]
  }
}