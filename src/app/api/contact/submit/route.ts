import { NextRequest, NextResponse } from 'next/server'
import { contactFormSchema } from '@/lib/validations'

// Rate limiting storage (in production, use Redis or a database)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

// Rate limiting function for contact forms (stricter limits)
function checkRateLimit(ip: string, maxRequests = 3, windowMs = 60000): boolean {
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

// Simulate contact form processing
async function processContactForm(data: any) {
  // In production, this would:
  // 1. Save inquiry to database
  // 2. Send notification email to admin
  // 3. Send confirmation email to user
  // 4. Create support ticket if needed
  // 5. Integrate with CRM
  
  const ticketId = data.inquiryType === 'support' 
    ? `SUP-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`
    : undefined
  
  // Simulate processing delay
  await new Promise(resolve => setTimeout(resolve, 200))
  
  return {
    ticketId,
    estimatedResponseTime: data.inquiryType === 'support' ? '2-4 hours' : '24 hours',
  }
}

export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const clientIp = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'unknown'
    
    // Check rate limit (stricter for contact forms)
    if (!checkRateLimit(clientIp, 3, 60000)) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'RATE_LIMIT_EXCEEDED',
            message: 'Too many contact form submissions. Please try again in a minute.',
          }
        },
        { 
          status: 429,
          headers: {
            'X-RateLimit-Limit': '3',
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': Math.floor((Date.now() + 60000) / 1000).toString(),
          }
        }
      )
    }
    
    // Parse and validate request body
    const body = await request.json()
    
    const validationResult = contactFormSchema.safeParse(body)
    
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
    
    // Basic spam detection
    const spamKeywords = ['viagra', 'casino', 'loan', 'crypto', 'bitcoin']
    const messageContent = data.message.toLowerCase()
    
    if (spamKeywords.some(keyword => messageContent.includes(keyword))) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'SPAM_DETECTED',
            message: 'Your message was flagged as potential spam. Please contact us directly.',
          }
        },
        { status: 400 }
      )
    }
    
    // Process the contact form
    const result = await processContactForm(data)
    
    // Log successful submission
    console.log('Contact form submitted:', {
      name: data.name,
      email: data.email,
      inquiryType: data.inquiryType,
      ticketId: result.ticketId,
      timestamp: new Date().toISOString(),
    })
    
    // Return success response
    const successMessage = result.ticketId 
      ? `Thank you for contacting us! Your support ticket ${result.ticketId} has been created. We'll respond within ${result.estimatedResponseTime}.`
      : `Thank you for contacting us! We've received your ${data.inquiryType} inquiry and will respond within ${result.estimatedResponseTime}.`
    
    return NextResponse.json({
      success: true,
      message: successMessage,
      ticketId: result.ticketId,
    })
    
  } catch (error) {
    console.error('Contact form submission error:', error)
    
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