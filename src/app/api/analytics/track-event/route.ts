import { NextRequest, NextResponse } from 'next/server'
import { analyticsEventSchema } from '@/lib/validations'

// Rate limiting storage (in production, use Redis or a database)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

// Rate limiting function for analytics (higher limits)
function checkRateLimit(ip: string, maxRequests = 100, windowMs = 60000): boolean {
  const now = Date.now()
  const resetTime = now + windowMs
  
  const current = rateLimitMap.get(ip)
  
  if (!current || now > current.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime })
    return true
  }
  
  if (current.count >= maxRequests) {
    return false
  }
  
  current.count++
  return true
}

// Process analytics event
function processAnalyticsEvent(data: any, clientInfo: any) {
  // In production, this would:
  // 1. Store event in analytics database
  // 2. Forward to analytics services (Google Analytics, Mixpanel, etc.)
  // 3. Trigger real-time dashboards
  // 4. Update user behavior profiles
  
  const eventId = `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  
  const enrichedEvent = {
    ...data,
    eventId,
    timestamp: new Date().toISOString(),
    clientInfo,
  }
  
  // Log event (in production, send to analytics service)
  console.log('Analytics event tracked:', enrichedEvent)
  
  return { eventId }
}

export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const clientIp = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'unknown'
    
    // Check rate limit (higher limit for analytics)
    if (!checkRateLimit(clientIp, 100, 60000)) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'RATE_LIMIT_EXCEEDED',
            message: 'Analytics rate limit exceeded.',
          }
        },
        { 
          status: 429,
          headers: {
            'X-RateLimit-Limit': '100',
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': Math.floor((Date.now() + 60000) / 1000).toString(),
          }
        }
      )
    }
    
    // Parse and validate request body
    const body = await request.json()
    
    const validationResult = analyticsEventSchema.safeParse(body)
    
    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid analytics data',
            details: validationResult.error.issues,
          }
        },
        { status: 400 }
      )
    }
    
    const data = validationResult.data
    
    // Collect client information
    const clientInfo = {
      ip: clientIp,
      userAgent: request.headers.get('user-agent'),
      referer: request.headers.get('referer'),
      acceptLanguage: request.headers.get('accept-language'),
    }
    
    // Process the analytics event
    const result = processAnalyticsEvent(data, clientInfo)
    
    // Return success response
    return NextResponse.json({
      success: true,
      eventId: result.eventId,
    })
    
  } catch (error) {
    console.error('Analytics tracking error:', error)
    
    // For analytics, we typically want to fail silently to not impact UX
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Analytics tracking failed.',
        }
      },
      { status: 500 }
    )
  }
}

// Handle GET requests for health checks
export async function GET() {
  return NextResponse.json({
    success: true,
    message: 'Analytics tracking endpoint is operational',
    timestamp: new Date().toISOString(),
  })
}

// Handle other HTTP methods
export async function PUT() {
  return NextResponse.json(
    {
      success: false,
      error: {
        code: 'METHOD_NOT_ALLOWED',
        message: 'Only POST and GET requests are allowed for this endpoint.',
      }
    },
    { status: 405 }
  )
}

export async function DELETE() {
  return NextResponse.json(
    {
      success: false,
      error: {
        code: 'METHOD_NOT_ALLOWED',
        message: 'Only POST and GET requests are allowed for this endpoint.',
      }
    },
    { status: 405 }
  )
}