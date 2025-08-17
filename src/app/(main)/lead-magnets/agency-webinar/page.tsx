import { Metadata } from 'next'
import AgencyWebinarClient from './AgencyWebinarClient'

export const metadata: Metadata = {
  title: 'Free Webinar: Scale Your Agency Content Production | The Bigger Boss',
  description: 'Register for our exclusive webinar on scaling content production for marketing agencies. Learn how to deliver premium quality at scale while increasing profitability.',
  keywords: 'agency content strategy, content scaling, marketing agency, content production, agency growth, client content',
}

export default function AgencyWebinarPage() {
  return <AgencyWebinarClient />
}