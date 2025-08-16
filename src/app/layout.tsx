import type { Metadata } from 'next'
import '@/styles/globals.css'

export const metadata: Metadata = {
  title: 'The Bigger Boss - AI Content Strategist',
  description: 'Automate your entire strategic content lifecycle with AI. Turn your website into a powerful engine for growth.',
  keywords: ['AI content strategy', 'automated content', 'content marketing', 'SEO', 'business growth'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}