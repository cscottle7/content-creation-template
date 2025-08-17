import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '@/styles/globals.css'
import { AnalyticsProvider, GoogleAnalytics } from '@/components/providers/AnalyticsProvider'
import { StructuredData } from '@/components/seo/StructuredData'
import { generateMetadata, generateOrganizationSchema, generateWebsiteSchema, generateSoftwareApplicationSchema, pageSEOConfigs } from '@/lib/seo'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://thebiggerboss.com'),
  title: {
    default: 'The Bigger Boss - AI Content Strategist',
    template: '%s | The Bigger Boss'
  },
  description: 'AI-powered content strategy platform for Australian SMBs and marketing agencies',
  applicationName: 'The Bigger Boss',
  authors: [{ name: 'The Bigger Boss' }],
  creator: 'The Bigger Boss',
  publisher: 'The Bigger Boss',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Essential SEO and Meta Tags */}
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#10b981" />
        <meta name="msapplication-TileColor" content="#10b981" />
        <meta name="robots" content="index, follow" />
        <meta name="googlebot" content="index, follow" />
        <meta name="author" content="The Bigger Boss" />
        <meta name="generator" content="Next.js" />
        
        {/* Geo Targeting */}
        <meta name="geo.region" content="AU" />
        <meta name="geo.placename" content="Australia" />
        
        {/* Performance Hints */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="preconnect" href="https://www.google-analytics.com" />
        <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
        
        {/* Structured Data */}
        <StructuredData data={generateOrganizationSchema()} />
        <StructuredData data={generateWebsiteSchema()} />
        <StructuredData data={generateSoftwareApplicationSchema()} />
      </head>
      <body className={inter.className}>
        <AnalyticsProvider>
          {children}
        </AnalyticsProvider>
        {/* Google Analytics - replace with actual measurement ID in production */}
        <GoogleAnalytics measurementId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || ''} />
      </body>
    </html>
  )
}