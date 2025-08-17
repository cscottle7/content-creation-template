'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Input from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'

// Simplified schema for inline forms
const inlineLeadMagnetSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  firstName: z
    .string()
    .min(1, 'First name is required')
    .max(50, 'First name must be less than 50 characters'),
  persona: z.enum(['smb', 'agency']),
  magnetType: z.enum(['pdf', 'webinar']),
})

type InlineLeadMagnetFormData = z.infer<typeof inlineLeadMagnetSchema>

interface InlineLeadMagnetFormProps {
  persona: 'smb' | 'agency'
  magnetType: 'pdf' | 'webinar'
  title?: string
  buttonText?: string
  className?: string
  compact?: boolean
}

const InlineLeadMagnetForm = ({
  persona,
  magnetType,
  title = 'Get instant access to this resource',
  buttonText,
  className = '',
  compact = false
}: InlineLeadMagnetFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<InlineLeadMagnetFormData>({
    resolver: zodResolver(inlineLeadMagnetSchema),
    defaultValues: {
      persona,
      magnetType,
    }
  })

  const onSubmit = async (data: InlineLeadMagnetFormData) => {
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/lead-magnets/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          source: window.location.pathname,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to submit form')
      }

      setIsSubmitted(true)
      reset()

      // Track conversion event
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'inline_lead_magnet_submit', {
          event_category: 'Lead Generation',
          event_label: `${persona}_${magnetType}_inline`,
          value: 1
        })
      }

    } catch (error) {
      console.error('Form submission error:', error)
      // Handle error silently for inline forms to maintain UX
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className={`bg-green-50 border border-green-200 rounded-lg p-6 text-center ${className}`}>
        <div className="text-green-800">
          <h4 className="font-semibold mb-2">Success! 🎉</h4>
          <p className="text-sm">
            Check your email for {magnetType === 'pdf' ? 'the download link' : 'webinar access details'}.
          </p>
        </div>
      </div>
    )
  }

  const defaultButtonText = magnetType === 'pdf' 
    ? 'Get Free Download' 
    : 'Register Now'

  return (
    <div className={`bg-blue-50 border border-blue-200 rounded-lg p-6 ${className}`}>
      <div className="text-center mb-4">
        <h4 className="font-semibold text-gray-900 mb-2">{title}</h4>
        <p className="text-sm text-gray-600">
          {magnetType === 'pdf' 
            ? 'Download our comprehensive guide instantly' 
            : 'Secure your spot in our exclusive webinar'
          }
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {compact ? (
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <Input
                {...register('firstName')}
                label="First Name"
                placeholder="First name"
                error={errors.firstName?.message}
                required
                autoComplete="given-name"
              />
            </div>
            <div className="flex-1">
              <Input
                {...register('email')}
                type="email"
                label="Email Address"
                placeholder="Email address"
                error={errors.email?.message}
                required
                autoComplete="email"
              />
            </div>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="sm:w-auto whitespace-nowrap"
            >
              {isSubmitting ? 'Processing...' : (buttonText || defaultButtonText)}
            </Button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                {...register('firstName')}
                label="First Name"
                placeholder="Enter your first name"
                error={errors.firstName?.message}
                required
                autoComplete="given-name"
              />
              <Input
                {...register('email')}
                label="Email Address"
                type="email"
                placeholder="Enter your email address"
                error={errors.email?.message}
                required
                autoComplete="email"
              />
            </div>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full"
            >
              {isSubmitting ? 'Processing...' : (buttonText || defaultButtonText)}
            </Button>
          </>
        )}

        {/* Hidden fields */}
        <input type="hidden" {...register('persona')} value={persona} />
        <input type="hidden" {...register('magnetType')} value={magnetType} />
      </form>

      <p className="text-xs text-gray-500 text-center mt-3">
        No spam, unsubscribe at any time.
      </p>
    </div>
  )
}

export default InlineLeadMagnetForm