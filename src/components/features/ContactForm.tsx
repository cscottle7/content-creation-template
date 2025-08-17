'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { contactFormSchema, type ContactFormData } from '@/lib/validations'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Textarea from '@/components/ui/Textarea'
import { Button } from '@/components/ui/Button'

interface ContactFormProps {
  className?: string
  onSuccess?: (data: ContactFormData) => void
}

const ContactForm = ({ className = '', onSuccess }: ContactFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
  })

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true)
    setSubmitMessage(null)

    try {
      const response = await fetch('/api/contact/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error?.message || 'Failed to submit form')
      }

      setSubmitMessage({
        type: 'success',
        text: 'Thank you for your message! We\'ll get back to you within 24 hours.'
      })

      reset()
      onSuccess?.(data)

      // Track contact form submission
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'contact_form_submit', {
          event_category: 'Contact',
          event_label: data.inquiryType,
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

  const inquiryTypeOptions = [
    { value: 'general', label: 'General Inquiry' },
    { value: 'sales', label: 'Sales & Pricing' },
    { value: 'support', label: 'Technical Support' },
    { value: 'partnership', label: 'Partnership Opportunities' },
  ]

  return (
    <div className={`bg-white rounded-xl shadow-lg p-8 border border-gray-200 ${className}`}>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-3">Get in Touch</h2>
        <p className="text-gray-600">
          Have a question about The Bigger Boss? We'd love to hear from you. 
          Send us a message and we'll respond as soon as possible.
        </p>
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            {...register('name')}
            label="Full Name"
            type="text"
            placeholder="Enter your full name"
            error={errors.name?.message}
            required
            autoComplete="name"
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            {...register('company')}
            label="Company/Organization"
            type="text"
            placeholder="Enter your company name"
            error={errors.company?.message}
            autoComplete="organization"
          />
          
          <Input
            {...register('phone')}
            label="Phone Number"
            type="tel"
            placeholder="Enter your phone number"
            error={errors.phone?.message}
            autoComplete="tel"
          />
        </div>

        <Select
          {...register('inquiryType')}
          label="Type of Inquiry"
          options={inquiryTypeOptions}
          placeholder="Select the type of inquiry"
          error={errors.inquiryType?.message}
          required
        />

        <Textarea
          {...register('message')}
          label="Message"
          placeholder="Tell us how we can help you..."
          rows={6}
          error={errors.message?.message}
          required
          helperText="Please provide as much detail as possible to help us assist you better."
        />

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full"
          size="lg"
        >
          {isSubmitting ? 'Sending Message...' : 'Send Message'}
        </Button>

        <p className="text-xs text-gray-500 text-center">
          By submitting this form, you agree to our{' '}
          <a href="/privacy" className="text-blue-600 hover:text-blue-800 underline">
            Privacy Policy
          </a>{' '}
          and{' '}
          <a href="/terms" className="text-blue-600 hover:text-blue-800 underline">
            Terms of Service
          </a>.
        </p>
      </form>
    </div>
  )
}

export default ContactForm