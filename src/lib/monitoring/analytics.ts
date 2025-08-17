/**
 * Advanced Analytics Configuration
 * Integrates multiple analytics providers and custom tracking
 */

// Analytics Event Types
export interface AnalyticsEvent {
  name: string
  properties: Record<string, any>
  timestamp?: string
  userId?: string
  sessionId?: string
}

// Business Metrics
export interface BusinessMetric {
  name: string
  value: number
  unit: 'count' | 'percentage' | 'currency' | 'time' | 'bytes'
  category: 'conversion' | 'engagement' | 'performance' | 'business'
  timestamp: string
}

// KPI Definitions based on project goals
export const KPI_DEFINITIONS = {
  // Short-term metrics (30 days)
  shortTerm: {
    uniqueVisitors: {
      target: 1000,
      description: 'Unique visitors to resource hub',
      metric: 'traffic.visitors',
      period: '30d'
    },
    leadMagnetCTR: {
      target: 15, // percentage
      description: 'Click-through rate from articles to lead magnets',
      metric: 'conversions.leadMagnetCTR',
      period: '30d'
    },
    resourceHubTraffic: {
      target: 1000,
      description: 'Total visitors to pillar and cluster pages',
      metric: 'traffic.resourceHub',
      period: '30d'
    }
  },
  
  // Long-term metrics (6+ months)
  longTerm: {
    topicalAuthorityGrowth: {
      target: 5, // top 5 ranking
      description: 'Search ranking for strategic keywords',
      metric: 'seo.averageRanking',
      period: '6m'
    },
    leadMagnetConversion: {
      target: 10, // percentage
      description: 'Lead magnet downloads / unique visitors',
      metric: 'conversions.leadMagnetRate',
      period: '6m'
    },
    leadToTrialConversion: {
      target: 5, // percentage
      description: 'Lead magnet downloads to trial signups',
      metric: 'conversions.leadToTrial',
      period: '6m'
    }
  }
}

// Analytics Configuration
export class AnalyticsManager {
  private providers: Map<string, any> = new Map()
  private eventQueue: AnalyticsEvent[] = []
  private isInitialized = false

  constructor() {
    this.initializeProviders()
  }

  private async initializeProviders() {
    // Google Analytics 4
    if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID) {
      this.providers.set('ga4', {
        measurementId: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID,
        track: this.trackGA4Event.bind(this)
      })
    }

    // Vercel Analytics
    if (typeof window !== 'undefined') {
      this.providers.set('vercel', {
        track: this.trackVercelEvent.bind(this)
      })
    }

    // Custom Analytics
    this.providers.set('custom', {
      track: this.trackCustomEvent.bind(this)
    })

    this.isInitialized = true
    this.flushEventQueue()
  }

  // Track events across all providers
  public track(event: AnalyticsEvent) {
    if (!this.isInitialized) {
      this.eventQueue.push(event)
      return
    }

    this.providers.forEach((provider, name) => {
      try {
        provider.track(event)
      } catch (error) {
        console.warn(`Analytics provider ${name} failed:`, error)
      }
    })
  }

  // Business-specific tracking methods
  public trackConversion(type: 'lead_magnet' | 'contact_form' | 'trial_signup', properties: Record<string, any> = {}) {
    this.track({
      name: 'conversion',
      properties: {
        type,
        value: this.getConversionValue(type),
        ...properties
      }
    })
  }

  public trackPagePerformance(metrics: {
    url: string
    loadTime: number
    fcp: number
    lcp: number
    cls: number
  }) {
    this.track({
      name: 'page_performance',
      properties: {
        ...metrics,
        deviceType: this.getDeviceType(),
        connectionType: this.getConnectionType()
      }
    })
  }

  public trackUserJourney(step: string, persona: 'smb' | 'agency', properties: Record<string, any> = {}) {
    this.track({
      name: 'user_journey',
      properties: {
        step,
        persona,
        timestamp: Date.now(),
        ...properties
      }
    })
  }

  public trackBusinessMetric(metric: BusinessMetric) {
    this.track({
      name: 'business_metric',
      properties: {
        metricName: metric.name,
        value: metric.value,
        unit: metric.unit,
        category: metric.category
      }
    })

    // Store in custom analytics endpoint
    this.sendToCustomAnalytics(metric)
  }

  // Provider-specific implementations
  private trackGA4Event(event: AnalyticsEvent) {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', event.name, {
        ...event.properties,
        custom_parameter_timestamp: event.timestamp || new Date().toISOString()
      })
    }
  }

  private trackVercelEvent(event: AnalyticsEvent) {
    // Vercel Analytics integration
    if (typeof window !== 'undefined' && window.va) {
      window.va('track', event.name, event.properties)
    }
  }

  private async trackCustomEvent(event: AnalyticsEvent) {
    try {
      await fetch('/api/analytics/track-event', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          event: event.name,
          properties: event.properties,
          timestamp: event.timestamp || new Date().toISOString(),
          sessionId: this.getSessionId()
        })
      })
    } catch (error) {
      console.warn('Custom analytics tracking failed:', error)
    }
  }

  private async sendToCustomAnalytics(metric: BusinessMetric) {
    try {
      await fetch('/api/monitoring/metrics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          metric: metric.name,
          value: metric.value,
          timestamp: metric.timestamp
        })
      })
    } catch (error) {
      console.warn('Custom metrics tracking failed:', error)
    }
  }

  private flushEventQueue() {
    while (this.eventQueue.length > 0) {
      const event = this.eventQueue.shift()
      if (event) {
        this.track(event)
      }
    }
  }

  private getConversionValue(type: string): number {
    const values = {
      'lead_magnet': 100, // Estimated value per lead
      'contact_form': 250, // Higher value for direct contact
      'trial_signup': 500  // Highest value for trial
    }
    return values[type as keyof typeof values] || 0
  }

  private getDeviceType(): string {
    if (typeof window === 'undefined') return 'unknown'
    
    const width = window.innerWidth
    if (width < 768) return 'mobile'
    if (width < 1024) return 'tablet'
    return 'desktop'
  }

  private getConnectionType(): string {
    if (typeof navigator !== 'undefined' && 'connection' in navigator) {
      const connection = (navigator as any).connection
      return connection?.effectiveType || 'unknown'
    }
    return 'unknown'
  }

  private getSessionId(): string {
    if (typeof window === 'undefined') return 'server-session'
    
    let sessionId = sessionStorage.getItem('analytics_session_id')
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      sessionStorage.setItem('analytics_session_id', sessionId)
    }
    return sessionId
  }
}

// KPI Monitoring Class
export class KPIMonitor {
  private analytics: AnalyticsManager

  constructor(analytics: AnalyticsManager) {
    this.analytics = analytics
  }

  public async checkKPIStatus(period: '30d' | '6m' = '30d'): Promise<Record<string, any>> {
    try {
      const response = await fetch(`/api/monitoring/metrics?period=${period}&details=true`)
      const data = await response.json()
      
      if (!data.success) {
        throw new Error(data.error)
      }

      const kpiDefinitions = period === '30d' ? KPI_DEFINITIONS.shortTerm : KPI_DEFINITIONS.longTerm
      const kpiStatus: Record<string, any> = {}

      Object.entries(kpiDefinitions).forEach(([kpiName, definition]) => {
        const currentValue = this.extractMetricValue(data.data, definition.metric)
        const target = definition.target
        const progress = (currentValue / target) * 100

        kpiStatus[kpiName] = {
          name: definition.description,
          current: currentValue,
          target: target,
          progress: Math.round(progress),
          status: progress >= 100 ? 'achieved' : progress >= 80 ? 'on-track' : progress >= 50 ? 'at-risk' : 'critical',
          period: definition.period
        }
      })

      return kpiStatus
    } catch (error) {
      console.error('KPI monitoring error:', error)
      return {}
    }
  }

  private extractMetricValue(data: any, metricPath: string): number {
    const path = metricPath.split('.')
    let value = data
    
    for (const key of path) {
      value = value?.[key]
    }
    
    return typeof value === 'number' ? value : 0
  }

  public async generateKPIReport(): Promise<string> {
    const shortTermKPIs = await this.checkKPIStatus('30d')
    const longTermKPIs = await this.checkKPIStatus('6m')

    let report = '# KPI Performance Report\n\n'
    
    report += '## Short-term KPIs (30 days)\n'
    Object.entries(shortTermKPIs).forEach(([key, kpi]: [string, any]) => {
      const status = kpi.status === 'achieved' ? '✅' : kpi.status === 'on-track' ? '🟢' : kpi.status === 'at-risk' ? '🟡' : '🔴'
      report += `${status} **${kpi.name}**: ${kpi.current} / ${kpi.target} (${kpi.progress}%)\n`
    })

    report += '\n## Long-term KPIs (6 months)\n'
    Object.entries(longTermKPIs).forEach(([key, kpi]: [string, any]) => {
      const status = kpi.status === 'achieved' ? '✅' : kpi.status === 'on-track' ? '🟢' : kpi.status === 'at-risk' ? '🟡' : '🔴'
      report += `${status} **${kpi.name}**: ${kpi.current} / ${kpi.target} (${kpi.progress}%)\n`
    })

    return report
  }
}

// Global analytics instance
export const analytics = new AnalyticsManager()
export const kpiMonitor = new KPIMonitor(analytics)

// Helper functions for common tracking scenarios
export function trackLeadMagnetDownload(magnetType: 'pdf' | 'webinar', persona: 'smb' | 'agency') {
  analytics.trackConversion('lead_magnet', {
    magnetType,
    persona,
    source: window.location.pathname
  })
}

export function trackFormSubmission(formType: 'contact' | 'lead_magnet', success: boolean) {
  analytics.track({
    name: 'form_submission',
    properties: {
      formType,
      success,
      url: window.location.pathname,
      timestamp: Date.now()
    }
  })
}

export function trackPageView(url: string, title: string) {
  analytics.track({
    name: 'page_view',
    properties: {
      url,
      title,
      referrer: document.referrer,
      userAgent: navigator.userAgent
    }
  })
}

// Declare global va for TypeScript
declare global {
  interface Window {
    va: (...args: any[]) => void
  }
}