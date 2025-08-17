import { NextRequest, NextResponse } from 'next/server'
import { abTestConversionSchema } from '@/lib/validations'

// Rate limiting storage
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

function checkRateLimit(ip: string, maxRequests = 50, windowMs = 60000): boolean {
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

// Process A/B test conversion
function processConversion(data: any, clientInfo: any) {
  // In production, this would:
  // 1. Store conversion in analytics database
  // 2. Update A/B test statistics
  // 3. Trigger real-time dashboards
  // 4. Calculate statistical significance
  
  const conversionId = `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  
  const enrichedConversion = {
    ...data,
    conversionId,
    timestamp: new Date().toISOString(),
    clientInfo,
  }
  
  // Log conversion (in production, send to analytics service)
  console.log('A/B test conversion tracked:', enrichedConversion)
  
  return { conversionId }
}

export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const clientIp = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'unknown'
    
    // Check rate limit
    if (!checkRateLimit(clientIp, 50, 60000)) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'RATE_LIMIT_EXCEEDED',
            message: 'A/B test conversion tracking rate limit exceeded.',
          }
        },
        { 
          status: 429,
          headers: {
            'X-RateLimit-Limit': '50',
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': Math.floor((Date.now() + 60000) / 1000).toString(),
          }
        }
      )
    }
    
    // Parse and validate request body
    const body = await request.json()
    
    const validationResult = abTestConversionSchema.safeParse(body)
    
    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid A/B test conversion data',
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
    
    // Process the conversion
    const result = processConversion(data, clientInfo)
    
    // Return success response
    return NextResponse.json({
      success: true,
      conversionId: result.conversionId,
    })
    
  } catch (error) {
    console.error('A/B test conversion error:', error)
    
    // Fail silently for analytics to not impact UX
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'A/B test conversion tracking failed.',
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
    message: 'A/B test conversion tracking endpoint is operational',
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