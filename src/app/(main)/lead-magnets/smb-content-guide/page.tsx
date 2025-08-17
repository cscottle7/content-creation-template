import { Metadata } from 'next'
import SMBContentGuideClient from './SMBContentGuideClient'

export const metadata: Metadata = {
  title: 'Free Content Strategy Guide for Small Businesses | The Bigger Boss',
  description: 'Download our comprehensive content strategy guide designed specifically for small business owners. Learn how to compete with bigger businesses and turn your website into a reliable growth engine.',
  keywords: 'small business content strategy, content marketing guide, small business marketing, content planning, business growth',
}

export default function SMBContentGuidePage() {
  return <SMBContentGuideClient />
}