# The Bigger Boss - Technical Stack Reference

## Project Overview
The Bigger Boss is an AI-powered SaaS platform website built with modern web technologies to deliver high-performance, conversion-focused marketing pages targeting Australian SMBs and marketing agencies.

## Technology Stack

### Core Framework
- **Next.js 13+ with App Router**: File-system based routing with TypeScript support
- **TypeScript**: Full type safety across the application
- **React 18**: Component-based UI with Concurrent Features

### Styling & Animation
- **Tailwind CSS v3+**: Utility-first CSS with JIT compilation
- **Framer Motion**: Production-ready animations and layout transitions
- **React Three Fiber**: 3D graphics for future interactive elements

### Deployment & Infrastructure
- **Vercel**: Zero-config deployment with global CDN
- **Next.js API Routes**: Serverless functions for lead magnets
- **Vercel Analytics**: Performance monitoring and Core Web Vitals

## Project Structure

```
src/
├── app/                     # Next.js App Router
│   ├── (main)/             # Route group for marketing pages
│   │   ├── layout.tsx      # Shared layout (Header, Footer)
│   │   ├── page.tsx        # Homepage
│   │   ├── about/          # About page
│   │   ├── contact/        # Contact page
│   │   ├── pricing/        # Pricing page
│   │   └── solutions/      # Persona-specific solution pages
│   │       ├── for-agencies/
│   │       └── for-smbs/
│   ├── api/                # Serverless API routes
│   └── layout.tsx          # Root layout
├── components/             # Reusable React components
│   ├── ui/                 # Generic UI elements
│   ├── features/           # Feature-specific components
│   └── layout/             # Layout components
├── lib/                    # Utilities and custom hooks
└── styles/                 # Global styles
```

## Development Guidelines

### Next.js App Router Best Practices
- Use Server Components by default for better performance
- Client Components only when interactivity is required
- Leverage `loading.tsx` and `error.tsx` for better UX
- Implement proper SEO with metadata API
- Use route groups `()` for organization without URL impact

### TypeScript Configuration
- Strict type checking enabled
- Custom types for page props and API responses
- Type-safe environment variables
- Component prop interfaces

### Tailwind CSS Implementation
- Utility-first approach for rapid development
- Custom components using `@apply` directive
- Responsive design with mobile-first approach
- Dark mode support configured but not implemented

### Performance Optimization
- Image optimization with `next/image`
- Automatic code splitting at route level
- Font optimization and preloading
- Bundle analysis for production builds

## Environment Setup

### Required Environment Variables
```bash
# Public variables (exposed to browser)
NEXT_PUBLIC_SITE_URL=https://thebiggerboss.com
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX

# Server-side variables
EMAIL_SERVICE_API_KEY=your_email_api_key
ANALYTICS_API_KEY=your_analytics_key
```

### Development Commands
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # TypeScript type checking
```

## Key Features Implementation

### Lead Magnet System
- Form components in `components/features/LeadMagnetForm`
- API routes in `app/api/lead-magnets/`
- Email capture with user intent qualification
- A/B testing infrastructure for PDF vs webinar validation

### Persona-Specific Pages
- **SMB Solutions** (`/solutions/for-smbs`): Focused on simplicity and ROI
- **Agency Solutions** (`/solutions/for-agencies`): Emphasis on strategic depth and efficiency

### Animation Strategy
- Framer Motion for page transitions and micro-interactions
- Performance-first approach with hardware acceleration
- Progressive enhancement for complex animations
- Future 3D elements with React Three Fiber

## Deployment Configuration

### Vercel Settings
- Automatic deployments from Git
- Preview deployments for all branches
- Production deployment from `main` branch
- Custom domain configuration for thebiggerboss.com

### Performance Targets
- Core Web Vitals optimization
- First Contentful Paint < 1.5s
- Largest Contentful Paint < 2.5s
- Cumulative Layout Shift < 0.1

## Success Metrics Integration

### Analytics Implementation
- Vercel Analytics for performance monitoring
- Google Tag Manager for conversion tracking
- Custom events for lead magnet interactions
- Heat mapping for user behavior analysis

### Key Performance Indicators
- **Traffic Goal**: 1,000 unique visitors (first 30 days)
- **Engagement**: 15% CTR on lead magnets
- **Conversion**: 10% lead magnet conversion rate
- **Trial Conversion**: 5% lead-to-trial rate

## Security & Compliance

### Security Measures
- HTTPS enforcement via Vercel
- Environment variable protection
- API route authentication
- CSRF protection for forms

### Privacy Compliance
- GDPR-compliant data collection
- Cookie consent implementation
- Privacy policy integration
- Data retention policies

## Future Enhancements

### Deferred Features (Out of Scope for MVP)
- Interactive "Agent Brain" scrolling layout
- WebGL 3D workflow animations
- Advanced ROI calculator tools
- Real-time collaboration features

### Scalability Considerations
- CDN optimization for global audience
- Database integration for user management
- Microservices architecture for complex features
- Load balancing for high-traffic scenarios

## Troubleshooting & Maintenance

### Common Issues
- Build failures: Check TypeScript errors and environment variables
- Performance degradation: Monitor bundle size and Core Web Vitals
- Deployment issues: Verify Vercel configuration and API limits

### Monitoring Tools
- Vercel Analytics Dashboard
- Next.js Bundle Analyzer
- Lighthouse performance audits
- Error tracking with Vercel Functions logs

---

*Last Updated: Generated via context7 MCP documentation research*
*Next Review: Post-MVP launch (estimated 3 months)*