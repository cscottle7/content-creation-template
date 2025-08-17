import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

// Page view schema
const pageViewSchema = z.object({
  page: z.string().min(1, 'Page URL is required'),
  title: z.string().min(1, 'Page title is required'),
  referrer: z.string().optional(),
  userAgent: z.string().min(1, 'User agent is required'),
  sessionId: z.string().min(1, 'Session ID is required'),
  utmParams: z.object({
    source: z.string().optional(),
    medium: z.string().optional(),
    campaign: z.string().optional(),
    term: z.string().optional(),
    content: z.string().optional(),
  }).optional(),
})

// Rate limiting storage
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

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

// Process page view
function processPageView(data: any, clientInfo: any) {
  // In production, this would:
  // 1. Store page view in analytics database
  // 2. Update session tracking
  // 3. Trigger real-time visitor counts
  // 4. Update funnel analytics
  
  const viewId = `view_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  
  const enrichedView = {
    ...data,
    viewId,
    timestamp: new Date().toISOString(),
    clientInfo,
  }
  
  // Log page view (in production, send to analytics service)
  console.log('Page view tracked:', enrichedView)
  
  return { viewId }
}

export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const clientIp = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'unknown'
    
    // Check rate limit
    if (!checkRateLimit(clientIp, 100, 60000)) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'RATE_LIMIT_EXCEEDED',
            message: 'Page view tracking rate limit exceeded.',
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
    
    const validationResult = pageViewSchema.safeParse(body)
    
    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid page view data',
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
      realUserAgent: request.headers.get('user-agent'),
      acceptLanguage: request.headers.get('accept-language'),
      acceptEncoding: request.headers.get('accept-encoding'),
    }
    
    // Process the page view
    const result = processPageView(data, clientInfo)
    
    // Return success response
    return NextResponse.json({
      success: true,
      viewId: result.viewId,
    })
    
  } catch (error) {
    console.error('Page view tracking error:', error)
    
    // Fail silently for analytics to not impact UX
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Page view tracking failed.',
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
    message: 'Page view tracking endpoint is operational',
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