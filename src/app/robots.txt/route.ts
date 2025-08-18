import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const { origin } = new URL(request.url);
  
  const robotsTxt = `
User-agent: *
Allow: /

# Disallow admin and API routes
Disallow: /api/
Disallow: /admin/
Disallow: /_next/
Disallow: /private/

# Important pages
Sitemap: ${origin}/sitemap.xml

# Crawl-delay for bots
Crawl-delay: 1
`.trim();

  return new Response(robotsTxt, {
    headers: {
      'Content-Type': 'text/plain',
    },
  });
}