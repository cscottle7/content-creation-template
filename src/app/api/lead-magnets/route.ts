import { NextRequest, NextResponse } from 'next/server'

interface LeadMagnetRequest {
  firstName: string
  lastName?: string
  email: string
  company?: string
  challenge?: string
  persona: 'smb' | 'agency'
  magnetType: 'pdf' | 'webinar'
  source?: string
  utmParams?: {
    source?: string
    medium?: string
    campaign?: string
    term?: string
    content?: string
  }
}

// In a real application, this would integrate with:
// - Email service provider (e.g., ConvertKit, Mailchimp)
// - CRM system (e.g., HubSpot, Salesforce)
// - Analytics platform (e.g., Google Analytics, Mixpanel)
// - Lead scoring system

export async function POST(request: NextRequest) {
  try {
    const body: LeadMagnetRequest = await request.json()
    
    // Validate required fields
    if (!body.firstName || !body.email || !body.persona || !body.magnetType) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      )
    }

    // Log the lead capture for analytics
    console.log('Lead captured:', {
      ...body,
      timestamp: new Date().toISOString(),
      userAgent: request.headers.get('user-agent'),
      referer: request.headers.get('referer'),
    })

    // In production, you would:
    // 1. Save to database
    // 2. Add to email marketing list
    // 3. Send confirmation email with download link
    // 4. Trigger analytics events
    // 5. Update lead scoring

    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 500))

    // Return appropriate response based on magnet type
    if (body.magnetType === 'pdf') {
      return NextResponse.json({
        success: true,
        message: 'Thank you! Check your email for the download link.',
        downloadUrl: '/lead-magnets/smb-content-strategy-guide.pdf',
        nextSteps: [
          'Check your email for the download link',
          'Add our email to your contacts to ensure delivery',
          'Join our free Facebook community for ongoing tips',
        ]
      })
    } else if (body.magnetType === 'webinar') {
      return NextResponse.json({
        success: true,
        message: 'Registration confirmed! You\'ll receive webinar details via email.',
        webinarDetails: {
          date: 'Thursday, March 21st, 2024',
          time: '2:00 PM AEST',
          duration: '60 minutes + Q&A',
          platform: 'Zoom',
        },
        nextSteps: [
          'Check your email for webinar access details',
          'Add the event to your calendar',
          'Download the bonus materials',
          'Prepare your questions for the Q&A session',
        ]
      })
    }

    return NextResponse.json({
      success: true,
      message: 'Thank you for your interest!'
    })

  } catch (error) {
    console.error('Lead magnet API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Handle GET requests to provide magnet information
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const type = searchParams.get('type')

  const leadMagnets = {
    smb: {
      title: 'The Small Business Content Strategy Guide',
      description: 'Stop Losing Customers to Bigger Competitors',
      format: 'PDF',
      pages: 32,
      downloadTime: '< 30 seconds',
      topics: [
        'Understanding Your Competitive Advantage',
        'Content That Attracts Your Ideal Customers',
        'The Small Business Content Calendar',
        'Outranking Bigger Competitors'
      ]
    },
    agency: {
      title: 'Scale Content Production Without Sacrificing Quality',
      description: 'Agency Scaling Masterclass',
      format: 'Live Webinar',
      duration: '60 minutes + Q&A',
      registrationTime: '< 60 seconds',
      topics: [
        'The 5-pillar framework for scalable content operations',
        'How to maintain premium quality while increasing output 300%',
        'Client retention strategies through superior content delivery',
        'Pricing models that maximize profitability per account',
        'Team structures that support sustainable growth'
      ]
    }
  }

  if (type && (type === 'smb' || type === 'agency')) {
    return NextResponse.json(leadMagnets[type])
  }

  return NextResponse.json(leadMagnets)
}