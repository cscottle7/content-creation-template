'use client'

import { useState, useEffect } from 'react'
import { useABTestTracking } from './useAnalytics'

interface ABTestVariant {
  variant: string
  testId: string
}

interface UseABTestReturn extends ABTestVariant {
  isLoading: boolean
  trackConversion: (conversionType: string, value?: number) => void
}

// Custom hook for A/B testing
export function useABTest(testName: string, persona?: 'smb' | 'agency'): UseABTestReturn {
  const [variant, setVariant] = useState<string>('')
  const [testId, setTestId] = useState<string>('')
  const [isLoading, setIsLoading] = useState(true)
  
  const { trackInteraction, trackConversionForTest } = useABTestTracking(testId, variant)

  useEffect(() => {
    async function fetchVariant() {
      try {
        const params = new URLSearchParams({ test: testName })
        if (persona) params.append('persona', persona)
        
        const response = await fetch(`/api/ab-test/variant?${params}`, {
          headers: {
            'X-Session-ID': getSessionId(),
          }
        })
        
        if (response.ok) {
          const data = await response.json()
          if (data.success) {
            setVariant(data.variant)
            setTestId(data.testId)
          } else {
            // Fallback to default if test not found
            setVariant('default')
            setTestId(testName)
          }
        } else {
          // Fallback on error
          setVariant('default')
          setTestId(testName)
        }
      } catch (error) {
        console.warn('A/B test fetch failed:', error)
        // Fallback to default
        setVariant('default')
        setTestId(testName)
      } finally {
        setIsLoading(false)
      }
    }

    if (testName) {
      fetchVariant()
    }
  }, [testName, persona])

  // Helper function to get session ID
  function getSessionId(): string {
    if (typeof window === 'undefined') return ''
    
    let sessionId = sessionStorage.getItem('analytics_session_id')
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      sessionStorage.setItem('analytics_session_id', sessionId)
    }
    return sessionId
  }

  const trackConversion = (conversionType: string, value?: number) => {
    trackConversionForTest(conversionType, value)
  }

  return {
    variant,
    testId,
    isLoading,
    trackConversion,
  }
}

// Hook for testing different lead magnet types
export function useLeadMagnetABTest(persona: 'smb' | 'agency') {
  const { variant, isLoading, trackConversion } = useABTest('lead_magnet_type', persona)
  
  // Map variant to magnet type
  const magnetType: 'pdf' | 'webinar' = variant === 'webinar' ? 'webinar' : 'pdf'
  
  return {
    magnetType,
    isLoading,
    trackConversion,
  }
}

// Hook for testing different CTA button texts
export function useCTATextABTest() {
  const { variant, isLoading, trackConversion } = useABTest('cta_button_text')
  
  const getButtonText = (defaultText: string): string => {
    switch (variant) {
      case 'Get Started Free':
        return 'Get Started Free'
      case 'Start Your Trial':
        return 'Start Your Trial'
      case 'Try It Now':
        return 'Try It Now'
      default:
        return defaultText
    }
  }
  
  return {
    getButtonText,
    variant,
    isLoading,
    trackConversion,
  }
}

// Hook for testing different headlines
export function useHeadlineABTest() {
  const { variant, isLoading, trackConversion } = useABTest('hero_headline')
  
  const getHeadline = (defaultHeadline: string, alternativeHeadline?: string): string => {
    if (variant === 'variant_b' && alternativeHeadline) {
      return alternativeHeadline
    }
    return defaultHeadline
  }
  
  return {
    getHeadline,
    variant,
    isLoading,
    trackConversion,
  }
}