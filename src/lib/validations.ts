import { z } from 'zod'

// Lead Magnet Form Schema
export const leadMagnetSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  firstName: z
    .string()
    .min(1, 'First name is required')
    .max(50, 'First name must be less than 50 characters'),
  lastName: z
    .string()
    .optional(),
  company: z
    .string()
    .optional(),
  challenge: z
    .string()
    .optional(),
  persona: z
    .enum(['smb', 'agency'], {
      message: 'Please select your business type',
    }),
  magnetType: z
    .enum(['pdf', 'webinar'], {
      message: 'Please select a resource type',
    }),
  source: z
    .string()
    .optional(),
  utmParams: z
    .object({
      source: z.string().optional(),
      medium: z.string().optional(),
      campaign: z.string().optional(),
      term: z.string().optional(),
      content: z.string().optional(),
    })
    .optional(),
})

export type LeadMagnetFormData = z.infer<typeof leadMagnetSchema>

// Contact Form Schema
export const contactFormSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(100, 'Name must be less than 100 characters'),
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  company: z
    .string()
    .optional(),
  message: z
    .string()
    .min(10, 'Message must be at least 10 characters')
    .max(1000, 'Message must be less than 1000 characters'),
  inquiryType: z
    .enum(['general', 'sales', 'support', 'partnership'], {
      message: 'Please select an inquiry type',
    }),
  phone: z
    .string()
    .optional(),
})

export type ContactFormData = z.infer<typeof contactFormSchema>

// Analytics Event Schema
export const analyticsEventSchema = z.object({
  event: z.string().min(1, 'Event name is required'),
  properties: z.record(z.string(), z.any()).optional(),
  userId: z.string().optional(),
  sessionId: z.string().min(1, 'Session ID is required'),
})

export type AnalyticsEventData = z.infer<typeof analyticsEventSchema>

// A/B Test Conversion Schema
export const abTestConversionSchema = z.object({
  testId: z.string().min(1, 'Test ID is required'),
  variant: z.string().min(1, 'Variant is required'),
  conversionType: z.string().min(1, 'Conversion type is required'),
  sessionId: z.string().min(1, 'Session ID is required'),
})

export type ABTestConversionData = z.infer<typeof abTestConversionSchema>