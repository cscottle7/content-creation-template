import { NextRequest, NextResponse } from 'next/server'
import { leadMagnetSchema } from '@/lib/validations'
import { z } from 'zod'

// Rate limiting storage (in production, use Redis or a database)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

// Rate limiting function
function checkRateLimit(ip: string, maxRequests = 5, windowMs = 60000): boolean {
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

// Simulate lead magnet processing and email sending
async function processLeadMagnet(data: any) {
  // In production, this would:
  // 1. Save lead to database
  // 2. Send welcome email
  // 3. Generate download link or webinar access
  // 4. Update CRM system
  
  const leadId = `lead_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  
  // Simulate email sending delay
  await new Promise(resolve => setTimeout(resolve, 100))
  
  const downloadUrl = data.magnetType === 'pdf' 
    ? `/downloads/${data.persona}-content-strategy-guide.pdf`
    : undefined
    
  const accessLink = data.magnetType === 'webinar'
    ? `/webinars/automated-content-strategy?lead=${leadId}`
    : undefined
  
  return {
    leadId,
    downloadUrl,
    accessLink,
  }
}

export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const clientIp = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'unknown'
    
    // Check rate limit
    if (!checkRateLimit(clientIp)) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'RATE_LIMIT_EXCEEDED',
            message: 'Too many requests. Please try again in a minute.',
          }
        },
        { 
          status: 429,
          headers: {
            'X-RateLimit-Limit': '5',
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': Math.floor((Date.now() + 60000) / 1000).toString(),
          }
        }
      )
    }
    
    // Parse and validate request body
    const body = await request.json()
    
    const validationResult = leadMagnetSchema.safeParse(body)
    
    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid form data',
            details: validationResult.error.issues,
          }
        },
        { status: 400 }
      )
    }
    
    const data = validationResult.data
    
    // Process the lead magnet request
    const result = await processLeadMagnet(data)
    
    // Log successful submission (in production, use proper logging)
    console.log('Lead magnet submitted:', {
      leadId: result.leadId,
      email: data.email,
      persona: data.persona,
      magnetType: data.magnetType,
      timestamp: new Date().toISOString(),
    })
    
    // Return success response
    return NextResponse.json({
      success: true,
      message: data.magnetType === 'pdf' 
        ? 'Download link sent to your email!' 
        : 'Webinar access details sent to your email!',
      leadId: result.leadId,
      downloadUrl: result.downloadUrl,
      accessLink: result.accessLink,
    })
    
  } catch (error) {
    console.error('Lead magnet submission error:', error)
    
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'An unexpected error occurred. Please try again.',
        }
      },
      { status: 500 }
    )
  }
}

// Handle other HTTP methods
export async function GET() {
  return NextResponse.json(
    {
      success: false,
      error: {
        code: 'METHOD_NOT_ALLOWED',
        message: 'Only POST requests are allowed for this endpoint.',
      }
    },
    { status: 405 }
  )
}

export async function PUT() {
  return NextResponse.json(
    {
      success: false,
      error: {
        code: 'METHOD_NOT_ALLOWED',
        message: 'Only POST requests are allowed for this endpoint.',
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
        message: 'Only POST requests are allowed for this endpoint.',
      }
    },
    { status: 405 }
  )
}