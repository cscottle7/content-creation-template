/**
 * Deployment Readiness Assessment
 * Verifies all components are ready for production deployment
 */

const fs = require('fs');
const path = require('path');

class DeploymentReadinessChecker {
  constructor() {
    this.checks = [];
    this.errors = [];
    this.warnings = [];
  }

  async runAssessment() {
    console.log('🔍 Running Deployment Readiness Assessment...\n');

    await this.checkProjectStructure();
    await this.checkBuildConfiguration();
    await this.checkEnvironmentSetup();
    await this.checkTestCoverage();
    await this.checkSecurityConfiguration();
    await this.checkMonitoringSetup();
    await this.checkDocumentation();

    this.generateReadinessReport();
  }

  checkProjectStructure() {
    console.log('📁 Checking project structure...');

    const requiredFiles = [
      'package.json',
      'next.config.js',
      'vercel.json',
      'tailwind.config.ts',
      'tsconfig.json',
      'src/app/layout.tsx',
      'src/app/(main)/page.tsx'
    ];

    const requiredDirectories = [
      'src/app',
      'src/components',
      'src/lib',
      'tests',
      'scripts'
    ];

    let missingFiles = 0;
    let missingDirs = 0;

    requiredFiles.forEach(file => {
      if (!fs.existsSync(file)) {
        this.errors.push(`Missing required file: ${file}`);
        missingFiles++;
      }
    });

    requiredDirectories.forEach(dir => {
      if (!fs.existsSync(dir)) {
        this.errors.push(`Missing required directory: ${dir}`);
        missingDirs++;
      }
    });

    this.checks.push({
      category: 'Project Structure',
      test: 'Required Files and Directories',
      status: missingFiles === 0 && missingDirs === 0 ? 'pass' : 'fail',
      details: `${requiredFiles.length - missingFiles}/${requiredFiles.length} files, ${requiredDirectories.length - missingDirs}/${requiredDirectories.length} directories`
    });
  }

  checkBuildConfiguration() {
    console.log('🔨 Checking build configuration...');

    try {
      // Check package.json
      const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
      
      const requiredScripts = ['build', 'start', 'dev', 'lint'];
      const missingScripts = requiredScripts.filter(script => !packageJson.scripts[script]);
      
      this.checks.push({
        category: 'Build Configuration',
        test: 'Package.json Scripts',
        status: missingScripts.length === 0 ? 'pass' : 'fail',
        details: `${requiredScripts.length - missingScripts.length}/${requiredScripts.length} required scripts present`
      });

      // Check for production dependencies
      const requiredDeps = ['next', 'react', 'react-dom'];
      const missingDeps = requiredDeps.filter(dep => !packageJson.dependencies[dep]);
      
      this.checks.push({
        category: 'Build Configuration',
        test: 'Core Dependencies',
        status: missingDeps.length === 0 ? 'pass' : 'fail',
        details: `${requiredDeps.length - missingDeps.length}/${requiredDeps.length} core dependencies installed`
      });

      // Check Next.js configuration
      if (fs.existsSync('next.config.js')) {
        this.checks.push({
          category: 'Build Configuration',
          test: 'Next.js Configuration',
          status: 'pass',
          details: 'next.config.js present'
        });
      } else {
        this.warnings.push('next.config.js not found');
        this.checks.push({
          category: 'Build Configuration',
          test: 'Next.js Configuration',
          status: 'warning',
          details: 'next.config.js missing'
        });
      }

    } catch (error) {
      this.errors.push(`Build configuration check failed: ${error.message}`);
    }
  }

  checkEnvironmentSetup() {
    console.log('🌍 Checking environment configuration...');

    // Check for .env.example
    const hasEnvExample = fs.existsSync('.env.example');
    
    this.checks.push({
      category: 'Environment Setup',
      test: 'Environment Template',
      status: hasEnvExample ? 'pass' : 'warning',
      details: `.env.example ${hasEnvExample ? 'present' : 'missing'}`
    });

    // Check vercel.json configuration
    if (fs.existsSync('vercel.json')) {
      try {
        const vercelConfig = JSON.parse(fs.readFileSync('vercel.json', 'utf8'));
        
        const hasHeaders = vercelConfig.headers && vercelConfig.headers.length > 0;
        
        this.checks.push({
          category: 'Environment Setup',
          test: 'Vercel Configuration',
          status: hasHeaders ? 'pass' : 'warning',
          details: `vercel.json ${hasHeaders ? 'with security headers' : 'basic configuration'}`
        });
      } catch (error) {
        this.errors.push('Invalid vercel.json configuration');
      }
    } else {
      this.warnings.push('vercel.json not found');
    }

    // Check for required environment variables documentation
    if (hasEnvExample) {
      try {
        const envContent = fs.readFileSync('.env.example', 'utf8');
        const requiredVars = [
          'NEXT_PUBLIC_SITE_URL',
          'NEXT_PUBLIC_GA_MEASUREMENT_ID'
        ];
        
        const presentVars = requiredVars.filter(varName => envContent.includes(varName));
        
        this.checks.push({
          category: 'Environment Setup',
          test: 'Required Environment Variables',
          status: presentVars.length === requiredVars.length ? 'pass' : 'warning',
          details: `${presentVars.length}/${requiredVars.length} required variables documented`
        });
      } catch (error) {
        this.warnings.push('Could not read .env.example');
      }
    }
  }

  checkTestCoverage() {
    console.log('🧪 Checking test coverage...');

    const testFiles = [
      'tests/cross-browser-testing.js',
      'tests/accessibility-audit.js',
      'tests/performance-testing.js',
      'tests/user-acceptance-testing.js',
      'tests/monitoring-validation.js',
      'tests/production-validation.js'
    ];

    const existingTests = testFiles.filter(test => fs.existsSync(test));
    
    this.checks.push({
      category: 'Test Coverage',
      test: 'Testing Suite Completeness',
      status: existingTests.length >= 5 ? 'pass' : existingTests.length >= 3 ? 'warning' : 'fail',
      details: `${existingTests.length}/${testFiles.length} test suites available`
    });

    // Check if test results exist (indicating tests have been run)
    const testResults = [
      'cross-browser-report.json',
      'accessibility-report.json',
      'performance-report.json',
      'uat-report.json',
      'monitoring-validation-report.json'
    ];

    const existingResults = testResults.filter(result => fs.existsSync(result));
    
    this.checks.push({
      category: 'Test Coverage',
      test: 'Test Execution History',
      status: existingResults.length >= 4 ? 'pass' : existingResults.length >= 2 ? 'warning' : 'fail',
      details: `${existingResults.length}/${testResults.length} test reports found`
    });
  }

  checkSecurityConfiguration() {
    console.log('🔒 Checking security configuration...');

    // Check vercel.json for security headers
    if (fs.existsSync('vercel.json')) {
      try {
        const vercelConfig = JSON.parse(fs.readFileSync('vercel.json', 'utf8'));
        
        const securityHeaders = [
          'Strict-Transport-Security',
          'X-Frame-Options',
          'X-Content-Type-Options',
          'Referrer-Policy'
        ];

        let foundHeaders = 0;
        if (vercelConfig.headers) {
          vercelConfig.headers.forEach(headerConfig => {
            if (headerConfig.headers) {
              headerConfig.headers.forEach(header => {
                if (securityHeaders.includes(header.key)) {
                  foundHeaders++;
                }
              });
            }
          });
        }

        this.checks.push({
          category: 'Security Configuration',
          test: 'Security Headers',
          status: foundHeaders >= 3 ? 'pass' : foundHeaders >= 2 ? 'warning' : 'fail',
          details: `${foundHeaders}/${securityHeaders.length} security headers configured`
        });

      } catch (error) {
        this.errors.push('Could not analyze security headers');
      }
    }

    // Check for gitignore
    const hasGitignore = fs.existsSync('.gitignore');
    let gitignoreScore = 0;
    
    if (hasGitignore) {
      try {
        const gitignoreContent = fs.readFileSync('.gitignore', 'utf8');
        const importantPatterns = ['.env.local', 'node_modules', '.next', '.vercel'];
        gitignoreScore = importantPatterns.filter(pattern => 
          gitignoreContent.includes(pattern)
        ).length;
      } catch (error) {
        this.warnings.push('Could not read .gitignore');
      }
    }

    this.checks.push({
      category: 'Security Configuration',
      test: 'Git Security',
      status: hasGitignore && gitignoreScore >= 3 ? 'pass' : 'warning',
      details: `gitignore ${hasGitignore ? 'present' : 'missing'}, ${gitignoreScore}/4 critical patterns`
    });
  }

  checkMonitoringSetup() {
    console.log('📊 Checking monitoring setup...');

    // Check monitoring API endpoints
    const monitoringFiles = [
      'src/app/api/monitoring/health/route.ts',
      'src/app/api/monitoring/metrics/route.ts',
      'src/lib/monitoring/analytics.ts'
    ];

    const existingMonitoring = monitoringFiles.filter(file => fs.existsSync(file));
    
    this.checks.push({
      category: 'Monitoring Setup',
      test: 'Monitoring Infrastructure',
      status: existingMonitoring.length === monitoringFiles.length ? 'pass' : 'warning',
      details: `${existingMonitoring.length}/${monitoringFiles.length} monitoring components present`
    });

    // Check if monitoring validation has been run
    const hasMonitoringReport = fs.existsSync('monitoring-validation-report.json');
    
    this.checks.push({
      category: 'Monitoring Setup',
      test: 'Monitoring Validation',
      status: hasMonitoringReport ? 'pass' : 'warning',
      details: `Monitoring ${hasMonitoringReport ? 'validated' : 'not validated'}`
    });
  }

  checkDocumentation() {
    console.log('📚 Checking documentation...');

    const documentationFiles = [
      'DEPLOYMENT_STRATEGY.md',
      'MONITORING_SETUP_GUIDE.md',
      'README.md'
    ];

    const existingDocs = documentationFiles.filter(doc => fs.existsSync(doc));
    
    this.checks.push({
      category: 'Documentation',
      test: 'Deployment Documentation',
      status: existingDocs.length >= 2 ? 'pass' : 'warning',
      details: `${existingDocs.length}/${documentationFiles.length} key documents present`
    });

    // Check deployment scripts
    const deploymentScripts = [
      'scripts/deploy-production.js'
    ];

    const existingScripts = deploymentScripts.filter(script => fs.existsSync(script));
    
    this.checks.push({
      category: 'Documentation',
      test: 'Deployment Scripts',
      status: existingScripts.length > 0 ? 'pass' : 'warning',
      details: `${existingScripts.length}/${deploymentScripts.length} deployment scripts available`
    });
  }

  generateReadinessReport() {
    console.log('\n🔍 Deployment Readiness Assessment Report');
    console.log('=' .repeat(55));

    // Calculate overall readiness
    const totalChecks = this.checks.length;
    const passedChecks = this.checks.filter(c => c.status === 'pass').length;
    const warningChecks = this.checks.filter(c => c.status === 'warning').length;
    const failedChecks = this.checks.filter(c => c.status === 'fail').length;

    const readinessScore = Math.round((passedChecks / totalChecks) * 100);

    console.log(`\n📊 Overall Readiness Score: ${readinessScore}%`);
    console.log(`  ✅ Passed: ${passedChecks}/${totalChecks}`);
    console.log(`  ⚠️  Warnings: ${warningChecks}/${totalChecks}`);
    console.log(`  ❌ Failed: ${failedChecks}/${totalChecks}`);

    // Group by category
    const categories = {};
    this.checks.forEach(check => {
      if (!categories[check.category]) {
        categories[check.category] = [];
      }
      categories[check.category].push(check);
    });

    console.log('\n📋 Detailed Assessment:');
    Object.entries(categories).forEach(([category, checks]) => {
      console.log(`\n  ${category}:`);
      checks.forEach(check => {
        const icon = check.status === 'pass' ? '✅' : check.status === 'warning' ? '⚠️' : '❌';
        console.log(`    ${icon} ${check.test}: ${check.details}`);
      });
    });

    // Display errors and warnings
    if (this.errors.length > 0) {
      console.log('\n🚨 Critical Issues:');
      this.errors.forEach(error => {
        console.log(`  ❌ ${error}`);
      });
    }

    if (this.warnings.length > 0) {
      console.log('\n⚠️ Warnings:');
      this.warnings.forEach(warning => {
        console.log(`  ⚠️ ${warning}`);
      });
    }

    // Deployment recommendation
    const isReady = readinessScore >= 80 && this.errors.length === 0;
    const hasMinorIssues = readinessScore >= 60 && this.errors.length === 0;

    console.log(`\n🚀 Deployment Recommendation: ${
      isReady ? '✅ READY FOR DEPLOYMENT' : 
      hasMinorIssues ? '⚠️ PROCEED WITH CAUTION' : 
      '❌ NOT READY - FIX CRITICAL ISSUES'
    }`);

    if (isReady) {
      console.log('\n🎯 Deployment Checklist:');
      console.log('  1. Run final pre-deployment tests');
      console.log('  2. Configure production environment variables');
      console.log('  3. Execute deployment script');
      console.log('  4. Monitor health checks post-deployment');
    } else if (hasMinorIssues) {
      console.log('\n⚠️ Recommended Actions:');
      console.log('  1. Address warning items if possible');
      console.log('  2. Ensure monitoring is configured');
      console.log('  3. Have rollback plan ready');
      console.log('  4. Monitor closely during deployment');
    } else {
      console.log('\n❌ Critical Actions Required:');
      console.log('  1. Fix all failed checks');
      console.log('  2. Address critical errors');
      console.log('  3. Re-run readiness assessment');
      console.log('  4. Do not proceed with deployment');
    }

    // Save readiness report
    const report = {
      timestamp: new Date().toISOString(),
      score: readinessScore,
      isReady,
      summary: {
        totalChecks,
        passedChecks,
        warningChecks,
        failedChecks
      },
      checks: this.checks,
      errors: this.errors,
      warnings: this.warnings
    };

    fs.writeFileSync('deployment-readiness-report.json', JSON.stringify(report, null, 2));
    console.log('\n💾 Readiness report saved to: deployment-readiness-report.json');

    return report;
  }
}

// Run assessment
async function main() {
  const checker = new DeploymentReadinessChecker();
  await checker.runAssessment();
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = DeploymentReadinessChecker;