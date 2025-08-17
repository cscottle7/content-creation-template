import { NextResponse } from 'next/server'

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://thebiggerboss.com'
  
  const robots = `User-agent: *
Allow: /

# Disallow admin and private areas
Disallow: /api/
Disallow: /admin/
Disallow: /_next/
Disallow: /private/

# Allow specific API endpoints that should be crawlable
Allow: /api/sitemap
Allow: /api/robots

# Sitemap location
Sitemap: ${baseUrl}/sitemap.xml

# Crawl delay for polite crawling
Crawl-delay: 1

# Specific rules for different bots
User-agent: Googlebot
Crawl-delay: 0

User-agent: Bingbot
Crawl-delay: 1

# Block known bad bots
User-agent: SemrushBot
Disallow: /

User-agent: AhrefsBot
Disallow: /

User-agent: MJ12bot
Disallow: /`

  return new NextResponse(robots, {
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400', // Cache for 24 hours
    },
  })
}