#!/bin/bash

# The Bigger Boss - Deployment Script
# This script handles the complete deployment process to Vercel

set -e  # Exit on any error

echo "🚀 Starting deployment process for The Bigger Boss..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root."
    exit 1
fi

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
fi

# Verify environment variables
echo "🔍 Checking environment configuration..."

if [ ! -f ".env.local" ]; then
    echo "⚠️  Warning: .env.local not found. Using .env.example as reference."
    echo "   Please ensure environment variables are set in Vercel dashboard."
fi

# Run pre-deployment checks
echo "🔧 Running pre-deployment checks..."

# Type checking
echo "  - TypeScript compilation..."
npm run type-check

# Linting
echo "  - ESLint checks..."
npm run lint

# Build test
echo "  - Build verification..."
npm run build

echo "✅ All pre-deployment checks passed!"

# Deploy to Vercel
echo "🌐 Deploying to Vercel..."

# Check if this is a production deployment
if [ "$1" = "production" ] || [ "$1" = "prod" ]; then
    echo "📦 Deploying to PRODUCTION..."
    vercel --prod
    
    echo "🎉 Production deployment complete!"
    echo "🔗 Your site is live at: https://thebiggerboss.com"
else
    echo "🧪 Deploying to PREVIEW..."
    vercel
    
    echo "🎉 Preview deployment complete!"
    echo "🔗 Check your deployment URL in the output above"
fi

# Post-deployment verification
echo "🔍 Running post-deployment verification..."

# Get the deployment URL
if [ "$1" = "production" ] || [ "$1" = "prod" ]; then
    DEPLOYMENT_URL="https://thebiggerboss.com"
else
    # For preview deployments, we'd need to parse the vercel output
    # For now, we'll skip this check for preview deployments
    echo "⏭️  Skipping verification for preview deployment"
    exit 0
fi

# Basic health checks
echo "  - Checking homepage..."
curl -f -s "$DEPLOYMENT_URL" > /dev/null && echo "    ✅ Homepage accessible" || echo "    ❌ Homepage check failed"

echo "  - Checking API health..."
curl -f -s "$DEPLOYMENT_URL/api/analytics/track-event" > /dev/null && echo "    ✅ API accessible" || echo "    ❌ API check failed"

echo "  - Checking sitemap..."
curl -f -s "$DEPLOYMENT_URL/sitemap.xml" > /dev/null && echo "    ✅ Sitemap accessible" || echo "    ❌ Sitemap check failed"

echo "  - Checking robots.txt..."
curl -f -s "$DEPLOYMENT_URL/robots.txt" > /dev/null && echo "    ✅ Robots.txt accessible" || echo "    ❌ Robots.txt check failed"

echo ""
echo "🎉 Deployment process complete!"
echo ""
echo "📊 Next steps:"
echo "  1. Monitor analytics for any issues"
echo "  2. Test lead magnet forms"
echo "  3. Verify A/B tests are running"
echo "  4. Check performance metrics"
echo ""

if [ "$1" = "production" ] || [ "$1" = "prod" ]; then
    echo "🔥 Production site: https://thebiggerboss.com"
    echo "📈 Analytics: Check your Google Analytics dashboard"
    echo "🧪 A/B Tests: Monitor conversion rates"
fi