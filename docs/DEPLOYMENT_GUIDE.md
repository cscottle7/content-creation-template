# The Bigger Boss - Deployment Guide

## Overview
This guide provides comprehensive instructions for deploying The Bigger Boss website to Vercel, including environment configuration, domain setup, and performance optimization.

## Prerequisites

### Required Accounts
- **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
- **GitHub Account**: For repository hosting and CI/CD
- **Custom Domain**: thebiggerboss.com (or your chosen domain)

### Local Development Setup
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Install project dependencies
npm install
```

## Initial Deployment

### 1. Connect Repository to Vercel

#### Option A: Vercel Dashboard
1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click "Add New..." → "Project"
3. Import from Git repository
4. Select The Bigger Boss repository
5. Configure project settings:
   - **Framework Preset**: Next.js
   - **Root Directory**: `./` (default)
   - **Build Command**: `next build` (auto-detected)
   - **Output Directory**: `.next` (auto-detected)

#### Option B: Vercel CLI
```bash
# From project root directory
vercel

# Follow prompts:
# ? Set up and deploy "~/bigger-boss"? [Y/n] y
# ? Which scope do you want to deploy to? [Your Account]
# ? Link to existing project? [y/N] n
# ? What's your project's name? the-bigger-boss
# ? In which directory is your code located? ./
```

### 2. Environment Variables Configuration

#### Production Environment Variables
Set these in Vercel Dashboard → Project → Settings → Environment Variables:

```bash
# Public Variables (exposed to browser)
NEXT_PUBLIC_SITE_URL=https://thebiggerboss.com
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# Private Variables (server-side only)
EMAIL_SERVICE_API_KEY=your_email_service_key
RESEND_API_KEY=re_xxxxxxxxxx
WEBHOOK_SECRET=your_webhook_secret
ANALYTICS_API_KEY=your_analytics_key

# Database (if implemented)
DATABASE_URL=postgresql://user:pass@host:port/db

# Third-party Integrations
HUBSPOT_API_KEY=your_hubspot_key
MAILCHIMP_API_KEY=your_mailchimp_key
```

#### Environment-Specific Configuration
```bash
# Development
vercel env add NEXT_PUBLIC_SITE_URL development
# Enter value: http://localhost:3000

# Preview
vercel env add NEXT_PUBLIC_SITE_URL preview
# Enter value: https://the-bigger-boss-preview.vercel.app

# Production
vercel env add NEXT_PUBLIC_SITE_URL production
# Enter value: https://thebiggerboss.com
```

## Domain Configuration

### 1. Add Custom Domain
In Vercel Dashboard → Project → Settings → Domains:

1. Click "Add" and enter: `thebiggerboss.com`
2. Add www subdomain: `www.thebiggerboss.com`
3. Set redirect from www to apex domain (or vice versa)

### 2. DNS Configuration
Configure these DNS records with your domain provider:

```
# A Record for apex domain
Type: A
Name: @
Value: 76.76.19.61
TTL: 300

# CNAME for www subdomain
Type: CNAME
Name: www
Value: cname.vercel-dns.com
TTL: 300
```

### 3. SSL Certificate
Vercel automatically provisions SSL certificates via Let's Encrypt. This process typically takes 5-10 minutes after DNS propagation.

## Build Configuration

### 1. Next.js Configuration (`next.config.js`)
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: ['thebiggerboss.com'],
    formats: ['image/avif', 'image/webp'],
  },
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT' },
          { key: 'Access-Control-Allow-Headers', value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version' },
        ],
      },
    ]
  },
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
    ]
  },
}

module.exports = nextConfig
```

### 2. Vercel Configuration (`vercel.json`)
```json
{
  "framework": "nextjs",
  "buildCommand": "next build",
  "devCommand": "next dev",
  "installCommand": "npm ci",
  "regions": ["syd1", "hnd1", "iad1"],
  "functions": {
    "app/api/lead-magnets/submit.js": {
      "maxDuration": 10
    }
  },
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "s-maxage=86400"
        }
      ]
    }
  ],
  "rewrites": [
    {
      "source": "/sitemap.xml",
      "destination": "/api/sitemap"
    }
  ]
}
```

## Performance Optimization

### 1. Image Optimization
```javascript
// Use Next.js Image component
import Image from 'next/image'

export default function HeroImage() {
  return (
    <Image
      src="/images/hero.jpg"
      alt="The Bigger Boss AI Content Platform"
      width={1200}
      height={600}
      priority
      placeholder="blur"
      blurDataURL="data:image/jpeg;base64,..."
    />
  )
}
```

### 2. Font Optimization
```javascript
// app/layout.tsx
import { Inter, Poppins } from 'next/font/google'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
})

const poppins = Poppins({
  weight: ['400', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
})
```

### 3. Bundle Analysis
```bash
# Install bundle analyzer
npm install --save-dev @next/bundle-analyzer

# Add to next.config.js
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

module.exports = withBundleAnalyzer(nextConfig)

# Run analysis
ANALYZE=true npm run build
```

## Monitoring & Analytics

### 1. Vercel Analytics Setup
```javascript
// app/layout.tsx
import { Analytics } from '@vercel/analytics/react'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
```

### 2. Google Analytics Integration
```javascript
// lib/gtag.js
export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID

export const gtag = (...args) => {
  window.gtag?.(...args)
}

export const pageview = (url) => {
  gtag('config', GA_TRACKING_ID, {
    page_path: url,
  })
}
```

### 3. Performance Monitoring
```javascript
// app/layout.tsx
export default function RootLayout({ children }) {
  useEffect(() => {
    // Track Core Web Vitals
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS(console.log)
      getFID(console.log)
      getFCP(console.log)
      getLCP(console.log)
      getTTFB(console.log)
    })
  }, [])

  return children
}
```

## CI/CD Pipeline

### 1. Automatic Deployments
Vercel automatically deploys:
- **Production**: Pushes to `main` branch
- **Preview**: Pushes to any other branch
- **Pull Requests**: Automatic preview deployments

### 2. Build Checks
```json
// package.json
{
  "scripts": {
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "type-check": "tsc --noEmit",
    "test": "jest",
    "test:ci": "jest --ci --coverage --watchAll=false"
  }
}
```

### 3. GitHub Actions (Optional)
```yaml
# .github/workflows/ci.yml
name: CI
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      - run: npm ci
      - run: npm run lint
      - run: npm run type-check
      - run: npm run test:ci
      - run: npm run build
```

## Deployment Checklist

### Pre-Deployment
- [ ] All environment variables configured
- [ ] Build passes locally (`npm run build`)
- [ ] TypeScript compilation succeeds
- [ ] ESLint passes without errors
- [ ] Tests pass (`npm test`)
- [ ] Performance audit completed

### Domain Setup
- [ ] DNS records configured correctly
- [ ] SSL certificate provisioned
- [ ] Domain redirects working
- [ ] www/non-www preference set

### Post-Deployment
- [ ] Site accessible via custom domain
- [ ] All pages loading correctly
- [ ] Lead magnet forms functional
- [ ] Analytics tracking active
- [ ] Performance metrics within targets
- [ ] Error monitoring configured

## Troubleshooting

### Common Issues

#### Build Failures
```bash
# Clear cache and reinstall
rm -rf .next node_modules package-lock.json
npm install
npm run build
```

#### Environment Variable Issues
```bash
# Check variable configuration
vercel env ls

# Pull latest variables
vercel env pull .env.local
```

#### Domain Configuration Problems
1. Verify DNS propagation: `nslookup thebiggerboss.com`
2. Check SSL certificate status in Vercel dashboard
3. Ensure CNAME points to `cname.vercel-dns.com`

### Performance Issues
1. Run Lighthouse audit
2. Check bundle size with analyzer
3. Monitor Core Web Vitals in Vercel dashboard
4. Optimize images and fonts

### Debugging Deployments
```bash
# View deployment logs
vercel logs [deployment-url]

# Check function logs
vercel logs --follow

# Debug build locally
vercel build
vercel dev
```

## Rollback Procedures

### Quick Rollback
1. Go to Vercel Dashboard → Project → Deployments
2. Find previous stable deployment
3. Click "Promote to Production"

### CLI Rollback
```bash
# List deployments
vercel list

# Promote specific deployment
vercel promote [deployment-url] --scope [team-name]
```

## Security Considerations

### Environment Security
- Never commit `.env` files to repository
- Use Vercel's encrypted environment variables
- Rotate API keys regularly
- Monitor for exposed secrets

### HTTPS Enforcement
- Always use HTTPS in production
- Set security headers via `next.config.js`
- Implement Content Security Policy (CSP)

### API Security
- Rate limiting on sensitive endpoints
- Input validation and sanitization
- CORS configuration
- Authentication for admin endpoints

---

*Generated via context7 MCP documentation research*
*Last Updated: Project initialization*
*Deployment Target: Vercel Platform*