'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { leadMagnetSchema, type LeadMagnetFormData } from '@/lib/validations'
import { useLeadMagnetTracking, useFormTracking } from '@/lib/hooks/useAnalytics'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Textarea from '@/components/ui/Textarea'
import { Button } from '@/components/ui/Button'

interface LeadMagnetFormProps {
  persona: 'smb' | 'agency'
  magnetType: 'pdf' | 'webinar'
  title?: string
  description?: string
  className?: string
  onSuccess?: (data: LeadMagnetFormData) => void
}

const LeadMagnetForm = ({
  persona,
  magnetType,
  title = 'Get Your Free Resource',
  description = 'Enter your details below to download your free resource.',
  className = '',
  onSuccess
}: LeadMagnetFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  
  // Analytics tracking hooks
  const { trackFormStart, trackFormSubmit, trackComplete } = useLeadMagnetTracking(persona, magnetType)
  const { trackFieldFocus, trackValidationError, trackFormSuccess } = useFormTracking('lead_magnet')
  
  // Track form start on first field focus
  const [hasStartedForm, setHasStartedForm] = useState(false)
  const handleFirstFieldFocus = (fieldName: string) => {
    if (!hasStartedForm) {
      setHasStartedForm(true)
      trackFormStart()
    }
    trackFieldFocus(fieldName)
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<LeadMagnetFormData>({
    resolver: zodResolver(leadMagnetSchema),
    defaultValues: {
      persona,
      magnetType,
    }
  })

  const onSubmit = async (data: LeadMagnetFormData) => {
    setIsSubmitting(true)
    setSubmitMessage(null)
    
    // Track form submission
    trackFormSubmit()

    try {
      // Add UTM parameters from URL if available
      const urlParams = new URLSearchParams(window.location.search)
      const utmParams = {
        source: urlParams.get('utm_source') || undefined,
        medium: urlParams.get('utm_medium') || undefined,
        campaign: urlParams.get('utm_campaign') || undefined,
        term: urlParams.get('utm_term') || undefined,
        content: urlParams.get('utm_content') || undefined,
      }

      const payload = {
        ...data,
        source: document.referrer || undefined,
        utmParams: Object.values(utmParams).some(value => value) ? utmParams : undefined,
      }

      const response = await fetch('/api/lead-magnets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to submit form')
      }

      setSubmitMessage({
        type: 'success',
        text: result.message || (magnetType === 'pdf' 
          ? 'Success! Check your email for the download link.' 
          : 'Success! Check your email for webinar access details.')
      })

      reset()
      
      // Track successful form completion
      trackFormSuccess()
      trackComplete()
      
      onSuccess?.(data)

      // Legacy Google Analytics tracking (keeping for compatibility)
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'lead_magnet_submit', {
          event_category: 'Lead Generation',
          event_label: `${persona}_${magnetType}`,
          value: 1
        })
      }

    } catch (error) {
      console.error('Form submission error:', error)
      setSubmitMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'Something went wrong. Please try again.'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const challengeOptions = persona === 'smb' 
    ? [
        { value: 'creating-consistent-content', label: 'Creating consistent content' },
        { value: 'finding-time-for-content', label: 'Finding time for content creation' },
        { value: 'understanding-my-audience', label: 'Understanding my target audience' },
        { value: 'competing-with-bigger-businesses', label: 'Competing with bigger businesses' },
        { value: 'measuring-content-success', label: 'Measuring content success' },
        { value: 'other', label: 'Other' },
      ]
    : [
        { value: 'scaling-content-production', label: 'Scaling content production' },
        { value: 'maintaining-quality-at-scale', label: 'Maintaining quality at scale' },
        { value: 'client-content-strategy', label: 'Developing client content strategies' },
        { value: 'proving-content-roi', label: 'Proving content ROI to clients' },
        { value: 'content-team-efficiency', label: 'Content team efficiency' },
        { value: 'other', label: 'Other' },
      ]

  return (
    <div className={`bg-white rounded-xl shadow-lg p-6 border border-gray-200 ${className}`}>
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>

      {submitMessage && (
        <div
          className={`p-4 rounded-lg mb-6 ${
            submitMessage.type === 'success'
              ? 'bg-green-50 text-green-800 border border-green-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
          role="alert"
        >
          {submitMessage.text}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            {...register('firstName')}
            label="First Name"
            type="text"
            placeholder="Enter your first name"
            error={errors.firstName?.message}
            required
            autoComplete="given-name"
            onFocus={() => handleFirstFieldFocus('firstName')}
          />
          
          <Input
            {...register('lastName')}
            label="Last Name"
            type="text"
            placeholder="Enter your last name"
            error={errors.lastName?.message}
            autoComplete="family-name"
          />
        </div>

        <Input
          {...register('email')}
          label="Email Address"
          type="email"
          placeholder="Enter your email address"
          error={errors.email?.message}
          required
          autoComplete="email"
          onFocus={() => handleFirstFieldFocus('email')}
        />

        <Input
          {...register('company')}
          label={persona === 'smb' ? 'Business Name' : 'Agency Name'}
          type="text"
          placeholder={persona === 'smb' ? 'Enter your business name' : 'Enter your agency name'}
          error={errors.company?.message}
          autoComplete="organization"
        />

        <Select
          {...register('challenge')}
          label={`What's your biggest ${persona === 'smb' ? 'content marketing' : 'content strategy'} challenge?`}
          options={challengeOptions}
          placeholder="Select your main challenge"
          error={errors.challenge?.message}
          helperText="This helps us provide more relevant resources"
        />

        {/* Hidden fields for persona and magnetType */}
        <input type="hidden" {...register('persona')} value={persona} />
        <input type="hidden" {...register('magnetType')} value={magnetType} />

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full"
          size="lg"
        >
          {isSubmitting 
            ? 'Processing...' 
            : magnetType === 'pdf' 
              ? 'Download Free Guide' 
              : 'Register for Webinar'
          }
        </Button>

        <p className="text-xs text-gray-500 text-center">
          By submitting this form, you agree to receive marketing communications from The Bigger Boss. 
          You can unsubscribe at any time. View our{' '}
          <a href="/privacy" className="text-blue-600 hover:text-blue-800 underline">
            Privacy Policy
          </a>.
        </p>
      </form>
    </div>
  )
}

export default LeadMagnetForm