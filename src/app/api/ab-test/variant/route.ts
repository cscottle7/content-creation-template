import { NextRequest, NextResponse } from 'next/server'

// A/B test configurations
const AB_TESTS = {
  'lead_magnet_type': {
    variants: ['pdf', 'webinar'],
    distribution: [50, 50], // Equal distribution
    active: true,
  },
  'cta_button_text': {
    variants: ['Get Started Free', 'Start Your Trial', 'Try It Now'],
    distribution: [34, 33, 33],
    active: true,
  },
  'hero_headline': {
    variants: ['variant_a', 'variant_b'],
    distribution: [50, 50],
    active: false, // Disabled for now
  },
}

// Session storage for consistent variant assignment
const sessionVariants = new Map<string, Record<string, string>>()

// Get variant based on session and test configuration
function getVariant(sessionId: string, testName: string, persona?: string): string | null {
  const test = AB_TESTS[testName as keyof typeof AB_TESTS]
  
  if (!test || !test.active) {
    return null
  }
  
  // Check if session already has a variant for this test
  let sessionTests = sessionVariants.get(sessionId)
  if (!sessionTests) {
    sessionTests = {}
    sessionVariants.set(sessionId, sessionTests)
  }
  
  if (sessionTests[testName]) {
    return sessionTests[testName]
  }
  
  // Assign new variant based on distribution
  let hash = 0
  const str = sessionId + testName + (persona || '')
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32-bit integer
  }
  
  const normalizedHash = Math.abs(hash) % 100
  let cumulativeDistribution = 0
  
  for (let i = 0; i < test.variants.length; i++) {
    cumulativeDistribution += test.distribution[i]
    if (normalizedHash < cumulativeDistribution) {
      const variant = test.variants[i]
      sessionTests[testName] = variant
      return variant
    }
  }
  
  // Fallback to first variant
  const variant = test.variants[0]
  sessionTests[testName] = variant
  return variant
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const testName = searchParams.get('test')
    const persona = searchParams.get('persona')
    
    if (!testName) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'MISSING_PARAMETER',
            message: 'Test name is required',
          }
        },
        { status: 400 }
      )
    }
    
    // Generate or get session ID from headers or cookies
    const sessionId = request.headers.get('x-session-id') || 
                     request.cookies.get('session_id')?.value ||
                     `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    const variant = getVariant(sessionId, testName, persona || undefined)
    
    if (!variant) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'TEST_NOT_FOUND',
            message: 'Test not found or inactive',
          }
        },
        { status: 404 }
      )
    }
    
    // Log A/B test assignment
    console.log('A/B test variant assigned:', {
      sessionId,
      testName,
      variant,
      persona,
      timestamp: new Date().toISOString(),
    })
    
    return NextResponse.json({
      success: true,
      variant,
      testId: testName,
      sessionId,
    })
    
  } catch (error) {
    console.error('A/B test variant error:', error)
    
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to get A/B test variant',
        }
      },
      { status: 500 }
    )
  }
}

// Handle other HTTP methods
export async function POST() {
  return NextResponse.json(
    {
      success: false,
      error: {
        code: 'METHOD_NOT_ALLOWED',
        message: 'Only GET requests are allowed for this endpoint.',
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
        message: 'Only GET requests are allowed for this endpoint.',
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
        message: 'Only GET requests are allowed for this endpoint.',
      }
    },
    { status: 405 }
  )
}