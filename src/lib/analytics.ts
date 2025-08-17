'use client'

// Analytics utility functions for tracking user behavior and conversions

interface AnalyticsEvent {
  event: string
  properties?: Record<string, any>
  userId?: string
  sessionId?: string
}

interface PageViewData {
  page: string
  title: string
  referrer?: string
  userAgent: string
  sessionId: string
  utmParams?: Record<string, string>
}

// Generate or get session ID
export function getSessionId(): string {
  if (typeof window === 'undefined') return ''
  
  let sessionId = sessionStorage.getItem('analytics_session_id')
  
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    sessionStorage.setItem('analytics_session_id', sessionId)
  }
  
  return sessionId
}

// Get UTM parameters from URL
export function getUtmParams(): Record<string, string> {
  if (typeof window === 'undefined') return {}
  
  const params = new URLSearchParams(window.location.search)
  const utmParams: Record<string, string> = {}
  
  const utmKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content']
  
  utmKeys.forEach(key => {
    const value = params.get(key)
    if (value) {
      utmParams[key] = value
    }
  })
  
  return utmParams
}

// Track custom events
export async function trackEvent(eventData: AnalyticsEvent): Promise<void> {
  try {
    const sessionId = getSessionId()
    
    const payload = {
      ...eventData,
      sessionId,
      properties: {
        ...eventData.properties,
        url: window.location.href,
        timestamp: Date.now(),
        userAgent: navigator.userAgent,
      }
    }
    
    // Send to our analytics API
    await fetch('/api/analytics/track-event', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
    
    // Also send to Google Analytics if available
    if (window.gtag) {
      window.gtag('event', eventData.event, {
        ...eventData.properties,
        custom_parameter: true,
      })
    }
    
  } catch (error) {
    // Fail silently to not impact user experience
    console.warn('Analytics tracking failed:', error)
  }
}

// Track page views
export async function trackPageView(additionalData?: Partial<PageViewData>): Promise<void> {
  try {
    if (typeof window === 'undefined') return
    
    const sessionId = getSessionId()
    const utmParams = getUtmParams()
    
    const payload: PageViewData = {
      page: window.location.pathname + window.location.search,
      title: document.title,
      referrer: document.referrer || undefined,
      userAgent: navigator.userAgent,
      sessionId,
      utmParams: Object.keys(utmParams).length > 0 ? utmParams : undefined,
      ...additionalData,
    }
    
    // Send to our analytics API
    await fetch('/api/analytics/page-view', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
    
    // Also send to Google Analytics if available
    if (window.gtag) {
      const gaId = (window as any).GA_MEASUREMENT_ID
      if (gaId) {
        window.gtag('config', gaId, {
          page_path: payload.page,
          page_title: payload.title,
        })
      }
    }
    
  } catch (error) {
    console.warn('Page view tracking failed:', error)
  }
}

// Track conversions for specific goals
export async function trackConversion(conversionType: string, value?: number, additionalProperties?: Record<string, any>): Promise<void> {
  await trackEvent({
    event: 'conversion',
    properties: {
      conversion_type: conversionType,
      value: value || 1,
      ...additionalProperties,
    }
  })
}

// Track lead magnet interactions
export async function trackLeadMagnetInteraction(action: string, persona: 'smb' | 'agency', magnetType: 'pdf' | 'webinar', additionalData?: Record<string, any>): Promise<void> {
  await trackEvent({
    event: 'lead_magnet_interaction',
    properties: {
      action, // 'view', 'start_form', 'submit_form', 'complete'
      persona,
      magnet_type: magnetType,
      ...additionalData,
    }
  })
}

// Track form interactions
export async function trackFormInteraction(formType: string, action: string, additionalData?: Record<string, any>): Promise<void> {
  await trackEvent({
    event: 'form_interaction',
    properties: {
      form_type: formType, // 'lead_magnet', 'contact', 'newsletter'
      action, // 'start', 'field_focus', 'validation_error', 'submit', 'success'
      ...additionalData,
    }
  })
}

// Track button clicks and CTA interactions
export async function trackCTAClick(ctaType: string, location: string, additionalData?: Record<string, any>): Promise<void> {
  await trackEvent({
    event: 'cta_click',
    properties: {
      cta_type: ctaType, // 'download_guide', 'register_webinar', 'get_started'
      location, // 'hero', 'sidebar', 'footer', 'article_inline'
      ...additionalData,
    }
  })
}

// Track user journey milestones
export async function trackMilestone(milestone: string, additionalData?: Record<string, any>): Promise<void> {
  await trackEvent({
    event: 'user_milestone',
    properties: {
      milestone, // 'first_visit', 'return_visitor', 'engaged_session', 'high_intent'
      ...additionalData,
    }
  })
}

// Enhanced tracking for A/B tests
export async function trackABTestEvent(testId: string, variant: string, eventType: string, additionalData?: Record<string, any>): Promise<void> {
  await trackEvent({
    event: 'ab_test_event',
    properties: {
      test_id: testId,
      variant,
      event_type: eventType, // 'exposure', 'interaction', 'conversion'
      ...additionalData,
    }
  })
}

// Track scroll depth and engagement
export function initializeEngagementTracking(): (() => void) | void {
  if (typeof window === 'undefined') return
  
  let maxScrollDepth = 0
  let engagementTimer: NodeJS.Timeout | null = null
  let isEngaged = false
  
  // Scroll depth tracking
  const trackScrollDepth = () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop
    const windowHeight = window.innerHeight
    const documentHeight = document.documentElement.scrollHeight
    
    const scrollDepth = Math.round((scrollTop + windowHeight) / documentHeight * 100)
    
    if (scrollDepth > maxScrollDepth) {
      maxScrollDepth = scrollDepth
      
      // Track milestone scroll depths
      if (scrollDepth >= 25 && maxScrollDepth < 25) {
        trackEvent({ event: 'scroll_depth_25' })
      } else if (scrollDepth >= 50 && maxScrollDepth < 50) {
        trackEvent({ event: 'scroll_depth_50' })
      } else if (scrollDepth >= 75 && maxScrollDepth < 75) {
        trackEvent({ event: 'scroll_depth_75' })
      } else if (scrollDepth >= 90 && maxScrollDepth < 90) {
        trackEvent({ event: 'scroll_depth_90' })
      }
    }
  }
  
  // Engagement tracking (time spent)
  const trackEngagement = () => {
    if (!isEngaged) {
      isEngaged = true
      engagementTimer = setTimeout(() => {
        trackMilestone('engaged_session', { time_spent: '30_seconds' })
      }, 30000)
      
      setTimeout(() => {
        trackMilestone('engaged_session', { time_spent: '60_seconds' })
      }, 60000)
    }
  }
  
  // Event listeners
  window.addEventListener('scroll', trackScrollDepth, { passive: true })
  window.addEventListener('mousemove', trackEngagement, { once: true })
  window.addEventListener('keydown', trackEngagement, { once: true })
  window.addEventListener('click', trackEngagement, { once: true })
  
  // Cleanup function
  return () => {
    window.removeEventListener('scroll', trackScrollDepth)
    window.removeEventListener('mousemove', trackEngagement)
    window.removeEventListener('keydown', trackEngagement)
    window.removeEventListener('click', trackEngagement)
    if (engagementTimer) {
      clearTimeout(engagementTimer)
    }
  }
}

// Initialize analytics on page load
export function initializeAnalytics(): void {
  if (typeof window === 'undefined') return
  
  // Track initial page view
  trackPageView()
  
  // Initialize engagement tracking
  initializeEngagementTracking()
  
  // Track return visitors
  const isReturningVisitor = localStorage.getItem('analytics_previous_visit')
  if (isReturningVisitor) {
    trackMilestone('return_visitor')
  } else {
    localStorage.setItem('analytics_previous_visit', 'true')
    trackMilestone('first_visit')
  }
}