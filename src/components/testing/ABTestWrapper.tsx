'use client'

import { ReactNode } from 'react'
import Image from 'next/image'
import { useABTest } from '@/lib/hooks/useABTest'

interface ABTestWrapperProps {
  testName: string
  variants: Record<string, ReactNode>
  defaultVariant?: string
  persona?: 'smb' | 'agency'
  fallback?: ReactNode
}

// Generic A/B test wrapper component
export function ABTestWrapper({ 
  testName, 
  variants, 
  defaultVariant = 'default', 
  persona,
  fallback 
}: ABTestWrapperProps) {
  const { variant, isLoading } = useABTest(testName, persona)
  
  if (isLoading) {
    return fallback || variants[defaultVariant] || null
  }
  
  return variants[variant] || variants[defaultVariant] || null
}

// Specific A/B test components for common use cases

interface ABTestButtonProps {
  testName: string
  texts: Record<string, string>
  defaultText: string
  className?: string
  onClick?: () => void
  [key: string]: any // Allow other button props
}

export function ABTestButton({ 
  testName, 
  texts, 
  defaultText, 
  className = '',
  onClick,
  ...props 
}: ABTestButtonProps) {
  const { variant, isLoading, trackConversion } = useABTest(testName)
  
  const handleClick = () => {
    trackConversion('button_click')
    onClick?.()
  }
  
  const buttonText = isLoading ? defaultText : (texts[variant] || defaultText)
  
  return (
    <button
      className={className}
      onClick={handleClick}
      {...props}
    >
      {buttonText}
    </button>
  )
}

interface ABTestHeadlineProps {
  testName: string
  headlines: Record<string, string>
  defaultHeadline: string
  className?: string
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
}

export function ABTestHeadline({ 
  testName, 
  headlines, 
  defaultHeadline, 
  className = '',
  as: Component = 'h1'
}: ABTestHeadlineProps) {
  const { variant, isLoading } = useABTest(testName)
  
  const headlineText = isLoading ? defaultHeadline : (headlines[variant] || defaultHeadline)
  
  return (
    <Component className={className}>
      {headlineText}
    </Component>
  )
}

interface ABTestImageProps {
  testName: string
  images: Record<string, { src: string; alt: string }>
  defaultImage: { src: string; alt: string }
  className?: string
  [key: string]: any // Allow other img props
}

export function ABTestImage({ 
  testName, 
  images, 
  defaultImage, 
  className = '',
  ...props 
}: ABTestImageProps) {
  const { variant, isLoading } = useABTest(testName)
  
  const image = isLoading ? defaultImage : (images[variant] || defaultImage)
  
  return (
    <Image
      src={image.src}
      alt={image.alt}
      className={className}
      width={500}
      height={300}
      {...props}
    />
  )
}

// Lead magnet specific A/B test component
interface ABTestLeadMagnetProps {
  persona: 'smb' | 'agency'
  children: (magnetType: 'pdf' | 'webinar', isLoading: boolean) => ReactNode
}

export function ABTestLeadMagnet({ persona, children }: ABTestLeadMagnetProps) {
  const { variant, isLoading } = useABTest('lead_magnet_type', persona)
  
  const magnetType: 'pdf' | 'webinar' = variant === 'webinar' ? 'webinar' : 'pdf'
  
  return <>{children(magnetType, isLoading)}</>
}