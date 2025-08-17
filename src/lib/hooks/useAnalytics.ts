'use client'

import { useEffect, useCallback } from 'react'
import { 
  trackEvent, 
  trackPageView, 
  trackConversion, 
  trackLeadMagnetInteraction, 
  trackFormInteraction,
  trackCTAClick,
  trackMilestone,
  trackABTestEvent,
  initializeAnalytics 
} from '@/lib/analytics'

interface UseAnalyticsReturn {
  trackEvent: typeof trackEvent
  trackPageView: typeof trackPageView
  trackConversion: typeof trackConversion
  trackLeadMagnetInteraction: typeof trackLeadMagnetInteraction
  trackFormInteraction: typeof trackFormInteraction
  trackCTAClick: typeof trackCTAClick
  trackMilestone: typeof trackMilestone
  trackABTestEvent: typeof trackABTestEvent
}

// Custom hook for analytics tracking
export function useAnalytics(): UseAnalyticsReturn {
  
  // Initialize analytics on component mount
  useEffect(() => {
    initializeAnalytics()
  }, [])
  
  return {
    trackEvent,
    trackPageView,
    trackConversion,
    trackLeadMagnetInteraction,
    trackFormInteraction,
    trackCTAClick,
    trackMilestone,
    trackABTestEvent,
  }
}

// Hook for tracking page views with route changes
export function usePageViewTracking(): void {
  useEffect(() => {
    // Track initial page view
    trackPageView()
    
    // Listen for route changes (Next.js specific)
    const handleRouteChange = () => {
      // Small delay to ensure document.title is updated
      setTimeout(() => {
        trackPageView()
      }, 100)
    }
    
    // For Next.js App Router, we can listen to navigation events
    // This is a simplified approach - in production you might want to use Next.js navigation events
    window.addEventListener('popstate', handleRouteChange)
    
    return () => {
      window.removeEventListener('popstate', handleRouteChange)
    }
  }, [])
}

// Hook for tracking form interactions automatically
export function useFormTracking(formType: string) {
  const trackFormStart = useCallback(() => {
    trackFormInteraction(formType, 'start')
  }, [formType])
  
  const trackFieldFocus = useCallback((fieldName: string) => {
    trackFormInteraction(formType, 'field_focus', { field_name: fieldName })
  }, [formType])
  
  const trackValidationError = useCallback((fieldName: string, errorMessage: string) => {
    trackFormInteraction(formType, 'validation_error', { 
      field_name: fieldName, 
      error_message: errorMessage 
    })
  }, [formType])
  
  const trackFormSubmit = useCallback(() => {
    trackFormInteraction(formType, 'submit')
  }, [formType])
  
  const trackFormSuccess = useCallback(() => {
    trackFormInteraction(formType, 'success')
  }, [formType])
  
  return {
    trackFormStart,
    trackFieldFocus,
    trackValidationError,
    trackFormSubmit,
    trackFormSuccess,
  }
}

// Hook for tracking lead magnet interactions
export function useLeadMagnetTracking(persona: 'smb' | 'agency', magnetType: 'pdf' | 'webinar') {
  const trackView = useCallback(() => {
    trackLeadMagnetInteraction('view', persona, magnetType)
  }, [persona, magnetType])
  
  const trackFormStart = useCallback(() => {
    trackLeadMagnetInteraction('start_form', persona, magnetType)
  }, [persona, magnetType])
  
  const trackFormSubmit = useCallback(() => {
    trackLeadMagnetInteraction('submit_form', persona, magnetType)
  }, [persona, magnetType])
  
  const trackComplete = useCallback(() => {
    trackLeadMagnetInteraction('complete', persona, magnetType)
    // Also track as conversion
    trackConversion('lead_magnet_download', 1, { persona, magnet_type: magnetType })
  }, [persona, magnetType])
  
  // Track view on component mount
  useEffect(() => {
    trackView()
  }, [trackView])
  
  return {
    trackView,
    trackFormStart,
    trackFormSubmit,
    trackComplete,
  }
}

// Hook for tracking CTA clicks with automatic click handlers
export function useCTATracking() {
  const trackCTA = useCallback((ctaType: string, location: string, additionalData?: Record<string, any>) => {
    return (event: React.MouseEvent) => {
      trackCTAClick(ctaType, location, additionalData)
      // Let the original click handler continue
    }
  }, [])
  
  return { trackCTA }
}

// Hook for A/B testing with analytics integration
export function useABTestTracking(testId: string, variant: string) {
  const trackExposure = useCallback(() => {
    trackABTestEvent(testId, variant, 'exposure')
  }, [testId, variant])
  
  const trackInteraction = useCallback((interactionType: string, additionalData?: Record<string, any>) => {
    trackABTestEvent(testId, variant, 'interaction', { 
      interaction_type: interactionType, 
      ...additionalData 
    })
  }, [testId, variant])
  
  const trackConversionForTest = useCallback((conversionType: string, value?: number) => {
    trackABTestEvent(testId, variant, 'conversion', { 
      conversion_type: conversionType, 
      value 
    })
    // Also track in the A/B test API
    fetch('/api/ab-test/convert', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        testId,
        variant,
        conversionType,
        sessionId: sessionStorage.getItem('analytics_session_id') || 'unknown'
      })
    }).catch(console.warn)
  }, [testId, variant])
  
  // Track exposure on component mount
  useEffect(() => {
    trackExposure()
  }, [trackExposure])
  
  return {
    trackInteraction,
    trackConversionForTest,
  }
}