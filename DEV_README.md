# The Bigger Boss - Developer Setup Guide

## Quick Start

```bash
# Clone the repository
git clone <repository-url>
cd bigger-boss

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Start development server
npm run dev
```

## Development Environment

### Required VSCode Extensions

Install the recommended extensions when prompted, or manually install:

- **Prettier** - Code formatting
- **ESLint** - Code linting
- **Tailwind CSS IntelliSense** - CSS class autocomplete
- **TypeScript Hero** - TypeScript enhancements
- **Auto Rename Tag** - HTML/JSX tag renaming
- **Path Intellisense** - File path autocomplete

### Available Scripts

```bash
# Development
npm run dev              # Start development server
npm run build           # Build for production
npm run start           # Start production server
npm run lint            # Run ESLint
npm run type-check      # TypeScript type checking

# Deployment
npm run deploy          # Deploy to Vercel preview
npm run deploy:prod     # Deploy to production
npm run vercel:login    # Login to Vercel CLI
npm run vercel:env      # List environment variables

# Utilities
npm run clean           # Clean build files
npm run analyze         # Bundle analyzer
```

### Project Structure

```
src/
├── app/                 # Next.js 13+ App Router
│   ├── (main)/         # Route group for main pages
│   │   ├── page.tsx    # Homepage
│   │   ├── about/      # About page
│   │   ├── contact/    # Contact page
│   │   ├── pricing/    # Pricing page
│   │   ├── solutions/  # Solution pages
│   │   └── lead-magnets/ # Lead magnet pages
│   └── api/            # API routes
│       ├── analytics/  # Analytics endpoints
│       ├── ab-test/    # A/B testing endpoints
│       ├── contact/    # Contact form endpoints
│       └── lead-magnets/ # Lead magnet endpoints
├── components/
│   ├── ui/             # Reusable UI components
│   ├── features/       # Feature-specific components
│   ├── layout/         # Layout components
│   ├── providers/      # Context providers
│   └── testing/        # A/B testing components
├── lib/
│   ├── hooks/          # Custom React hooks
│   ├── analytics.ts    # Analytics utilities
│   ├── validations.ts  # Zod schemas
│   └── utils.ts        # General utilities
└── styles/
    └── globals.css     # Global styles
```

## Development Workflow

### 1. Feature Development

1. Create a new branch: `git checkout -b feature/your-feature`
2. Make your changes following the established patterns
3. Test your changes: `npm run build && npm run type-check`
4. Commit with descriptive messages
5. Push and create a pull request

### 2. Code Quality

- **Formatting**: Prettier runs on save (configured in VSCode)
- **Linting**: ESLint catches common issues
- **Type Safety**: TypeScript ensures type correctness
- **Build Verification**: Always test builds before deploying

### 3. Testing Strategy

- **Manual Testing**: Test all user flows in development
- **Type Checking**: `npm run type-check` before commits
- **Build Testing**: `npm run build` to catch build issues
- **Cross-Browser**: Test in Chrome, Firefox, Safari, Edge

## Component Development Guidelines

### UI Components

- Use TypeScript interfaces for props
- Include proper accessibility attributes
- Follow the established design system
- Export default and named exports as needed

```typescript
interface ButtonProps {
  variant?: 'primary' | 'secondary'
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
}

export default function Button({ variant = 'primary', size = 'md', children }: ButtonProps) {
  // Implementation
}
```

### Form Components

- Use React Hook Form with Zod validation
- Include proper error handling
- Add analytics tracking
- Ensure accessibility compliance

### API Routes

- Use TypeScript for request/response types
- Include proper error handling
- Implement rate limiting
- Add input validation with Zod

## Analytics & A/B Testing

### Analytics Implementation

```typescript
import { useAnalytics } from '@/lib/hooks/useAnalytics'

function MyComponent() {
  const { trackEvent } = useAnalytics()
  
  const handleClick = () => {
    trackEvent({ event: 'button_click', properties: { location: 'header' } })
  }
}
```

### A/B Testing

```typescript
import { useABTest } from '@/lib/hooks/useABTest'

function MyComponent() {
  const { variant, isLoading } = useABTest('test_name')
  
  if (isLoading) return <div>Loading...</div>
  
  return <div>{variant === 'variant_a' ? 'Content A' : 'Content B'}</div>
}
```

## Environment Variables

Copy `.env.example` to `.env.local` and fill in the values:

```bash
# Required for development
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Analytics (optional in development)
NEXT_PUBLIC_GA_MEASUREMENT_ID=

# Email service (for lead magnets)
EMAIL_SERVICE_API_KEY=
```

## Debugging

### VSCode Debugging

1. Set breakpoints in your code
2. Press F5 or use "Run and Debug" panel
3. Choose appropriate debug configuration:
   - "Next.js: debug full stack" - Debug both client and server
   - "Next.js: debug server-side" - Debug API routes
   - "Debug API Route" - Specific API debugging

### Common Issues

**Build Errors:**
- Run `npm run type-check` to identify TypeScript issues
- Check for missing imports or type errors

**Styling Issues:**
- Ensure Tailwind classes are valid
- Check for CSS specificity conflicts
- Verify responsive design classes

**API Issues:**
- Check network tab for request/response details
- Verify API route implementations
- Check rate limiting and validation

## Deployment

### Preview Deployment
```bash
npm run deploy
```

### Production Deployment
```bash
npm run deploy:prod
```

### Manual Vercel Deployment
```bash
# Install Vercel CLI globally
npm install -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

## Performance Optimization

### Bundle Analysis
```bash
npm run analyze
```

### Core Web Vitals
- Monitor LCP, FID, and CLS metrics
- Use Next.js Image component for images
- Implement lazy loading for non-critical components
- Optimize font loading

### Caching Strategy
- Static assets: Long-term caching
- API responses: Short-term caching where appropriate
- Page data: ISR (Incremental Static Regeneration) when needed

## Security Considerations

- Never commit sensitive data to git
- Use environment variables for API keys
- Implement proper CORS headers
- Validate all user inputs
- Use HTTPS in production

## Support

For questions or issues:
1. Check this documentation first
2. Review existing code patterns
3. Check the project's issue tracker
4. Ask the team in development channels

---

Happy coding! 🚀