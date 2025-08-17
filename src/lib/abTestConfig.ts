// A/B Test Configuration
// This file centralizes all A/B test configurations for easy management

export interface ABTestConfig {
  name: string
  description: string
  variants: string[]
  distribution: number[]
  active: boolean
  targetAudience?: 'smb' | 'agency' | 'all'
  startDate?: Date
  endDate?: Date
  successMetric: string
  hypothesis: string
}

// Active A/B Tests Configuration
export const AB_TESTS: Record<string, ABTestConfig> = {
  'lead_magnet_type': {
    name: 'Lead Magnet Type Test',
    description: 'Test whether PDF guides or webinars perform better for lead generation',
    variants: ['pdf', 'webinar'],
    distribution: [50, 50],
    active: true,
    targetAudience: 'all',
    successMetric: 'lead_conversion_rate',
    hypothesis: 'Webinars will have higher conversion rates but PDFs will have higher quality leads',
  },
  
  'cta_button_text': {
    name: 'CTA Button Text Test',
    description: 'Test different call-to-action button texts for maximum click-through',
    variants: ['Get Started Free', 'Start Your Trial', 'Try It Now'],
    distribution: [34, 33, 33],
    active: true,
    targetAudience: 'all',
    successMetric: 'button_click_rate',
    hypothesis: '"Get Started Free" will perform best due to emphasis on no cost',
  },
  
  'hero_headline': {
    name: 'Hero Headline Test',
    description: 'Test different homepage hero headlines for engagement',
    variants: ['variant_a', 'variant_b'],
    distribution: [50, 50],
    active: false, // Disabled for now
    targetAudience: 'all',
    successMetric: 'page_engagement_time',
    hypothesis: 'More specific headlines will increase engagement',
  },
  
  'smb_pricing_display': {
    name: 'SMB Pricing Display Test',
    description: 'Test monthly vs annual pricing emphasis for SMB persona',
    variants: ['monthly_first', 'annual_first'],
    distribution: [50, 50],
    active: false,
    targetAudience: 'smb',
    successMetric: 'pricing_page_conversion',
    hypothesis: 'Annual pricing will increase customer lifetime value',
  },
  
  'agency_social_proof': {
    name: 'Agency Social Proof Test',
    description: 'Test different types of social proof for agency landing page',
    variants: ['testimonials', 'case_studies', 'client_logos'],
    distribution: [33, 33, 34],
    active: false,
    targetAudience: 'agency',
    successMetric: 'lead_form_completion',
    hypothesis: 'Case studies will be most convincing for B2B agency audience',
  },
}

// Helper functions for A/B test management
export function getActiveTests(): Record<string, ABTestConfig> {
  return Object.entries(AB_TESTS)
    .filter(([_, config]) => config.active)
    .reduce((acc, [key, config]) => {
      acc[key] = config
      return acc
    }, {} as Record<string, ABTestConfig>)
}

export function getTestsForAudience(audience: 'smb' | 'agency'): Record<string, ABTestConfig> {
  return Object.entries(AB_TESTS)
    .filter(([_, config]) => 
      config.active && (config.targetAudience === audience || config.targetAudience === 'all')
    )
    .reduce((acc, [key, config]) => {
      acc[key] = config
      return acc
    }, {} as Record<string, ABTestConfig>)
}

export function isTestActive(testName: string): boolean {
  const test = AB_TESTS[testName]
  if (!test) return false
  
  const now = new Date()
  const isActiveStatus = test.active
  const isInDateRange = (!test.startDate || now >= test.startDate) && 
                       (!test.endDate || now <= test.endDate)
  
  return isActiveStatus && isInDateRange
}

// Predefined test content variations
export const TEST_CONTENT = {
  hero_headlines: {
    variant_a: 'Automate Your Content Strategy with AI',
    variant_b: 'Generate 10x More Quality Content in Half the Time',
  },
  
  cta_buttons: {
    'Get Started Free': 'Get Started Free',
    'Start Your Trial': 'Start Your Trial', 
    'Try It Now': 'Try It Now',
  },
  
  smb_value_props: {
    efficiency: 'Save 20 hours per week on content creation',
    competition: 'Outrank competitors with AI-driven strategy',
    growth: 'Turn your website into a lead generation machine',
  },
  
  agency_value_props: {
    scale: 'Scale content production without hiring',
    quality: 'Maintain premium quality at 10x the speed',
    profit: 'Increase profit margins by 40%',
  },
}

// A/B test result tracking structure
export interface ABTestResult {
  testName: string
  variant: string
  metric: string
  value: number
  timestamp: Date
  sessionId: string
  userId?: string
}

// Helper to log test results (in production, this would go to analytics service)
export function logABTestResult(result: ABTestResult): void {
  console.log('A/B Test Result:', result)
  
  // In production, send to analytics service:
  // analyticsService.track('ab_test_result', result)
}