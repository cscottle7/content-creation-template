/**
 * Production Deployment Script and Checklist
 * Automates and validates production deployment for The Bigger Boss
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class ProductionDeployment {
  constructor() {
    this.checks = [];
    this.warnings = [];
    this.errors = [];
  }

  async runDeploymentChecks() {
    console.log('🚀 Running Production Deployment Checks...\n');

    // Pre-deployment checks
    await this.checkBuildSuccess();
    await this.checkEnvironmentVariables();
    await this.checkSecurityConfiguration();
    await this.checkPerformanceOptimizations();
    await this.checkSEOConfiguration();
    await this.checkAnalyticsSetup();
    
    this.generateDeploymentReport();
  }

  async checkBuildSuccess() {
    console.log('🔨 Checking Build Success...');
    
    try {
      // Run production build
      execSync('npm run build', { stdio: 'pipe' });
      this.checks.push('✅ Production build successful');
      
      // Check for build artifacts
      const buildDir = path.join(process.cwd(), '.next');
      if (fs.existsSync(buildDir)) {
        this.checks.push('✅ Build artifacts generated');
      } else {
        this.errors.push('❌ Build artifacts missing');
      }
      
    } catch (error) {
      this.errors.push(`❌ Build failed: ${error.message}`);
    }
  }

  async checkEnvironmentVariables() {
    console.log('🔧 Checking Environment Variables...');
    
    const requiredEnvVars = [
      'NEXT_PUBLIC_SITE_URL',
      'NEXT_PUBLIC_GA_MEASUREMENT_ID'
    ];
    
    const optionalEnvVars = [
      'SMTP_HOST',
      'SMTP_USER',
      'SMTP_PASS',
      'SENTRY_DSN'
    ];
    
    // Check required variables
    requiredEnvVars.forEach(varName => {
      if (process.env[varName]) {
        this.checks.push(`✅ ${varName} configured`);
      } else {
        this.warnings.push(`⚠️ ${varName} not configured - may affect functionality`);
      }
    });
    
    // Check optional variables
    optionalEnvVars.forEach(varName => {
      if (process.env[varName]) {
        this.checks.push(`✅ ${varName} configured`);
      } else {
        this.warnings.push(`⚠️ ${varName} not configured - optional feature may not work`);
      }
    });
  }

  async checkSecurityConfiguration() {
    console.log('🔒 Checking Security Configuration...');
    
    // Check vercel.json for security headers
    const vercelConfigPath = path.join(process.cwd(), 'vercel.json');
    
    if (fs.existsSync(vercelConfigPath)) {
      const vercelConfig = JSON.parse(fs.readFileSync(vercelConfigPath, 'utf8'));
      
      const requiredHeaders = [
        'X-Content-Type-Options',
        'X-Frame-Options',
        'X-XSS-Protection',
        'Strict-Transport-Security'
      ];
      
      const headers = vercelConfig.headers?.[0]?.headers || [];
      const headerKeys = headers.map(h => h.key);
      
      requiredHeaders.forEach(header => {
        if (headerKeys.includes(header)) {
          this.checks.push(`✅ Security header: ${header}`);
        } else {
          this.warnings.push(`⚠️ Missing security header: ${header}`);
        }
      });
      
    } else {
      this.errors.push('❌ vercel.json not found');
    }
    
    // Check for sensitive files
    const sensitiveFiles = ['.env', '.env.local', '.env.production'];
    sensitiveFiles.forEach(file => {
      if (fs.existsSync(path.join(process.cwd(), file))) {
        this.warnings.push(`⚠️ Sensitive file ${file} exists - ensure it's in .gitignore`);
      }
    });
  }

  async checkPerformanceOptimizations() {
    console.log('⚡ Checking Performance Optimizations...');
    
    // Check next.config.js for optimizations
    const nextConfigPath = path.join(process.cwd(), 'next.config.js');
    
    if (fs.existsSync(nextConfigPath)) {
      this.checks.push('✅ next.config.js exists');
      
      // Read and check configuration
      const configContent = fs.readFileSync(nextConfigPath, 'utf8');
      
      const optimizations = [
        { key: 'compress', description: 'Compression enabled' },
        { key: 'swcMinify', description: 'SWC minification enabled' },
        { key: 'images', description: 'Image optimization configured' }
      ];
      
      optimizations.forEach(opt => {
        if (configContent.includes(opt.key)) {
          this.checks.push(`✅ ${opt.description}`);
        } else {
          this.warnings.push(`⚠️ ${opt.description} not configured`);
        }
      });
      
    } else {
      this.warnings.push('⚠️ next.config.js not found - using defaults');
    }
    
    // Check for optimized assets
    const publicDir = path.join(process.cwd(), 'public');
    if (fs.existsSync(publicDir)) {
      const files = fs.readdirSync(publicDir, { recursive: true });
      const imageFiles = files.filter(f => /\.(jpg|png|gif|bmp)$/i.test(f));
      const webpFiles = files.filter(f => /\.webp$/i.test(f));
      
      if (webpFiles.length > 0) {
        this.checks.push('✅ WebP images found');
      } else if (imageFiles.length > 0) {
        this.warnings.push('⚠️ Consider converting images to WebP format');
      }
    }
  }

  async checkSEOConfiguration() {
    console.log('📈 Checking SEO Configuration...');
    
    // Check for sitemap endpoint
    const sitemapPath = path.join(process.cwd(), 'src/app/api/sitemap/route.ts');
    if (fs.existsSync(sitemapPath)) {
      this.checks.push('✅ Sitemap endpoint configured');
    } else {
      this.warnings.push('⚠️ Sitemap endpoint not found');
    }
    
    // Check for robots.txt endpoint
    const robotsPath = path.join(process.cwd(), 'src/app/api/robots/route.ts');
    if (fs.existsSync(robotsPath)) {
      this.checks.push('✅ Robots.txt endpoint configured');
    } else {
      this.warnings.push('⚠️ Robots.txt endpoint not found');
    }
    
    // Check for metadata configuration
    const seoLibPath = path.join(process.cwd(), 'src/lib/seo.ts');
    if (fs.existsSync(seoLibPath)) {
      this.checks.push('✅ SEO metadata library configured');
    } else {
      this.warnings.push('⚠️ SEO metadata library not found');
    }
  }

  async checkAnalyticsSetup() {
    console.log('📊 Checking Analytics Setup...');
    
    // Check for Google Analytics
    if (process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID) {
      this.checks.push('✅ Google Analytics measurement ID configured');
    } else {
      this.warnings.push('⚠️ Google Analytics not configured');
    }
    
    // Check for analytics components
    const analyticsProviderPath = path.join(process.cwd(), 'src/components/providers/AnalyticsProvider.tsx');
    if (fs.existsSync(analyticsProviderPath)) {
      this.checks.push('✅ Analytics provider component found');
    } else {
      this.warnings.push('⚠️ Analytics provider component not found');
    }
    
    // Check for A/B testing setup
    const abTestPath = path.join(process.cwd(), 'src/lib/hooks/useABTest.ts');
    if (fs.existsSync(abTestPath)) {
      this.checks.push('✅ A/B testing infrastructure configured');
    } else {
      this.warnings.push('⚠️ A/B testing infrastructure not found');
    }
  }

  generateDeploymentReport() {
    console.log('\n🚀 Production Deployment Report');
    console.log('=' .repeat(50));
    
    console.log(`\n✅ Checks Passed: ${this.checks.length}`);
    this.checks.forEach(check => console.log(`  ${check}`));
    
    if (this.warnings.length > 0) {
      console.log(`\n⚠️ Warnings: ${this.warnings.length}`);
      this.warnings.forEach(warning => console.log(`  ${warning}`));
    }
    
    if (this.errors.length > 0) {
      console.log(`\n❌ Errors: ${this.errors.length}`);
      this.errors.forEach(error => console.log(`  ${error}`));
    }
    
    // Overall deployment readiness
    const isReady = this.errors.length === 0 && this.warnings.length <= 3;
    
    console.log(`\n🏆 Deployment Readiness: ${isReady ? '✅ READY' : '⚠️ NEEDS ATTENTION'}`);
    
    if (!isReady) {
      console.log('\n🔧 Action Required:');
      if (this.errors.length > 0) {
        console.log('  1. Fix all errors before deployment');
      }
      if (this.warnings.length > 3) {
        console.log('  2. Review and address warnings');
      }
      console.log('  3. Re-run deployment checks');
    } else {
      console.log('\n🚀 Next Steps:');
      console.log('  1. Configure production environment variables in Vercel');
      console.log('  2. Set up custom domain');
      console.log('  3. Deploy to production');
      console.log('  4. Verify deployment and run post-launch checks');
    }
    
    // Save report
    const report = {
      timestamp: new Date().toISOString(),
      checks: this.checks,
      warnings: this.warnings,
      errors: this.errors,
      deploymentReady: isReady,
      summary: {
        totalChecks: this.checks.length,
        totalWarnings: this.warnings.length,
        totalErrors: this.errors.length
      }
    };
    
    fs.writeFileSync('production-deployment-report.json', JSON.stringify(report, null, 2));
    console.log('\n💾 Deployment report saved to: production-deployment-report.json');
  }
}

// Domain Configuration Guide
const domainSetupGuide = {
  title: "🌐 Domain Setup Guide for thebiggerboss.com.au",
  steps: [
    {
      step: 1,
      title: "Purchase Domain",
      description: "Register thebiggerboss.com.au through a registrar",
      providers: ["Namecheap", "GoDaddy", "Melbourne IT", "VentraIP"],
      estimated_time: "5-10 minutes"
    },
    {
      step: 2,
      title: "Configure Vercel Project",
      description: "Add domain to Vercel project settings",
      instructions: [
        "Go to Vercel dashboard → Project Settings → Domains",
        "Add thebiggerboss.com.au",
        "Add www.thebiggerboss.com.au (with redirect to non-www)"
      ],
      estimated_time: "2-3 minutes"
    },
    {
      step: 3,
      title: "Update DNS Records",
      description: "Point domain to Vercel",
      dns_records: [
        { type: "A", name: "@", value: "76.76.19.61" },
        { type: "CNAME", name: "www", value: "cname.vercel-dns.com" }
      ],
      note: "DNS propagation can take 24-48 hours",
      estimated_time: "5 minutes + propagation time"
    },
    {
      step: 4,
      title: "Verify SSL Certificate",
      description: "Ensure HTTPS is working",
      verification: "Visit https://thebiggerboss.com.au and check for SSL lock",
      estimated_time: "Automatic after DNS propagation"
    }
  ]
};

// Monitoring Setup Guide
const monitoringSetupGuide = {
  title: "📊 Production Monitoring Setup",
  components: [
    {
      name: "Vercel Analytics",
      setup: "Enable in Vercel project settings",
      features: ["Page views", "Performance metrics", "Audience insights"]
    },
    {
      name: "Google Analytics 4",
      setup: "Create GA4 property and add measurement ID to environment variables",
      features: ["User behavior", "Conversion tracking", "Custom events"]
    },
    {
      name: "Google Search Console",
      setup: "Add property and verify domain ownership",
      features: ["Search performance", "Indexing status", "Security issues"]
    },
    {
      name: "Sentry (Error Tracking)",
      setup: "Create Sentry project and add DSN to environment variables",
      features: ["Error monitoring", "Performance tracking", "Release tracking"]
    }
  ]
};

// Run deployment checks if script is executed directly
if (require.main === module) {
  const deployment = new ProductionDeployment();
  deployment.runDeploymentChecks().catch(console.error);
}

module.exports = {
  ProductionDeployment,
  domainSetupGuide,
  monitoringSetupGuide
};