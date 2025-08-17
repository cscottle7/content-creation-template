#!/usr/bin/env node

/**
 * Production Deployment Script with Rollback Capability
 * Automates the complete deployment process for The Bigger Boss website
 */

const { execSync, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

class ProductionDeployer {
  constructor() {
    this.projectRoot = process.cwd();
    this.deploymentLog = [];
    this.startTime = Date.now();
    this.previousDeployment = null;
    this.currentDeployment = null;
    this.isRollbackMode = process.argv.includes('--rollback');
  }

  log(message, level = 'info') {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] ${level.toUpperCase()}: ${message}`;
    
    console.log(logEntry);
    this.deploymentLog.push(logEntry);
    
    // Write to log file
    fs.appendFileSync('deployment.log', logEntry + '\n');
  }

  async execute(command, description) {
    this.log(`Executing: ${description}`);
    this.log(`Command: ${command}`, 'debug');
    
    try {
      const output = execSync(command, { 
        encoding: 'utf8', 
        cwd: this.projectRoot,
        stdio: 'pipe'
      });
      
      this.log(`✅ Success: ${description}`);
      return { success: true, output };
    } catch (error) {
      this.log(`❌ Failed: ${description}`, 'error');
      this.log(`Error: ${error.message}`, 'error');
      return { success: false, error: error.message };
    }
  }

  async runTests() {
    this.log('🧪 Running comprehensive test suite...');
    
    const tests = [
      { 
        command: 'npm run build', 
        description: 'Production build verification',
        critical: true 
      },
      { 
        command: 'npm run lint', 
        description: 'Code linting check',
        critical: false 
      },
      { 
        command: 'node tests/cross-browser-testing.js', 
        description: 'Cross-browser compatibility test',
        critical: true 
      },
      { 
        command: 'node tests/performance-testing.js', 
        description: 'Performance optimization test',
        critical: true 
      },
      { 
        command: 'node tests/accessibility-audit.js', 
        description: 'Accessibility compliance test',
        critical: false 
      }
    ];

    let criticalFailures = 0;
    let totalFailures = 0;

    for (const test of tests) {
      const result = await this.execute(test.command, test.description);
      
      if (!result.success) {
        totalFailures++;
        if (test.critical) {
          criticalFailures++;
        }
      }
    }

    if (criticalFailures > 0) {
      this.log(`❌ Deployment aborted: ${criticalFailures} critical test failures`, 'error');
      return false;
    }

    if (totalFailures > 0) {
      this.log(`⚠️ Proceeding with ${totalFailures} non-critical test warnings`, 'warn');
    }

    this.log('✅ All critical tests passed');
    return true;
  }

  async getCurrentDeployment() {
    try {
      const result = await this.execute('vercel ls --prod', 'Get current production deployment');
      if (result.success) {
        // Parse the output to get the current deployment URL
        const lines = result.output.split('\n').filter(line => line.trim());
        const deploymentLine = lines.find(line => line.includes('thebiggerboss.com.au'));
        
        if (deploymentLine) {
          // Extract deployment URL from the line
          const match = deploymentLine.match(/https:\/\/[a-zA-Z0-9-]+\.vercel\.app/);
          if (match) {
            this.previousDeployment = match[0];
            this.log(`📍 Current deployment: ${this.previousDeployment}`);
          }
        }
      }
    } catch (error) {
      this.log('⚠️ Could not determine current deployment', 'warn');
    }
  }

  async deployToVercel() {
    this.log('🚀 Deploying to Vercel production...');

    // Set environment variables for production
    const envVars = [
      'NEXT_PUBLIC_SITE_URL=https://thebiggerboss.com.au',
      'NODE_ENV=production'
    ];

    // Deploy to production
    const deployCommand = `vercel deploy --prod --force ${envVars.map(env => `--build-env ${env}`).join(' ')}`;
    const deployResult = await this.execute(deployCommand, 'Deploy to Vercel');

    if (!deployResult.success) {
      this.log('❌ Deployment failed', 'error');
      return false;
    }

    // Extract deployment URL from output
    const deploymentUrlMatch = deployResult.output.match(/https:\/\/[a-zA-Z0-9-]+\.vercel\.app/);
    if (deploymentUrlMatch) {
      this.currentDeployment = deploymentUrlMatch[0];
      this.log(`🎯 New deployment URL: ${this.currentDeployment}`);
    } else {
      this.log('⚠️ Could not extract deployment URL', 'warn');
    }

    return true;
  }

  async updateDomainAlias() {
    if (!this.currentDeployment) {
      this.log('❌ Cannot update domain alias: No deployment URL available', 'error');
      return false;
    }

    this.log('🌐 Updating domain alias to new deployment...');
    
    const aliasCommand = `vercel alias set ${this.currentDeployment} thebiggerboss.com.au`;
    const aliasResult = await this.execute(aliasCommand, 'Update domain alias');

    if (!aliasResult.success) {
      this.log('❌ Failed to update domain alias', 'error');
      return false;
    }

    this.log('✅ Domain alias updated successfully');
    return true;
  }

  async validateDeployment() {
    this.log('✅ Validating production deployment...');
    
    // Wait for DNS propagation
    this.log('⏳ Waiting 30 seconds for DNS propagation...');
    await new Promise(resolve => setTimeout(resolve, 30000));

    // Run production validation
    try {
      const validationResult = await this.execute(
        'node tests/production-validation.js', 
        'Production validation test suite'
      );

      if (!validationResult.success) {
        this.log('❌ Production validation failed', 'error');
        return false;
      }

      // Check if validation report exists and parse results
      if (fs.existsSync('production-validation-report.json')) {
        const report = JSON.parse(fs.readFileSync('production-validation-report.json', 'utf8'));
        
        if (report.summary.failed > 0 || report.errors.length > 0) {
          this.log(`❌ Validation failed: ${report.summary.failed} test failures, ${report.errors.length} errors`, 'error');
          return false;
        }

        this.log(`✅ Validation passed: ${report.summary.passed}/${report.summary.totalTests} tests (${report.summary.score}%)`);
      }

      return true;
    } catch (error) {
      this.log(`❌ Validation error: ${error.message}`, 'error');
      return false;
    }
  }

  async rollback() {
    this.log('🔄 Initiating rollback procedure...');

    if (!this.previousDeployment) {
      this.log('❌ Cannot rollback: No previous deployment available', 'error');
      return false;
    }

    // Switch alias back to previous deployment
    const rollbackCommand = `vercel alias set ${this.previousDeployment} thebiggerboss.com.au`;
    const rollbackResult = await this.execute(rollbackCommand, 'Rollback to previous deployment');

    if (!rollbackResult.success) {
      this.log('❌ Rollback failed', 'error');
      return false;
    }

    this.log(`✅ Rollback completed to: ${this.previousDeployment}`);
    
    // Validate rollback
    await new Promise(resolve => setTimeout(resolve, 15000)); // Wait for propagation
    
    try {
      const healthCheck = await this.execute(
        'curl -f https://thebiggerboss.com.au/api/monitoring/health',
        'Health check after rollback'
      );
      
      if (healthCheck.success) {
        this.log('✅ Rollback validation successful');
      } else {
        this.log('⚠️ Rollback validation failed - manual intervention required', 'warn');
      }
    } catch (error) {
      this.log('⚠️ Could not validate rollback', 'warn');
    }

    return true;
  }

  async setupMonitoring() {
    this.log('📊 Setting up post-deployment monitoring...');

    // Test monitoring endpoints
    const monitoringTests = [
      'curl -f https://thebiggerboss.com.au/api/monitoring/health',
      'curl -f https://thebiggerboss.com.au/api/monitoring/metrics'
    ];

    for (const test of monitoringTests) {
      const result = await this.execute(test, `Test monitoring endpoint: ${test.split(' ').pop()}`);
      if (!result.success) {
        this.log('⚠️ Monitoring endpoint may not be fully operational', 'warn');
      }
    }

    this.log('📈 Monitoring setup complete');
  }

  generateDeploymentReport() {
    const duration = Date.now() - this.startTime;
    
    const report = {
      timestamp: new Date().toISOString(),
      duration: Math.round(duration / 1000),
      previousDeployment: this.previousDeployment,
      currentDeployment: this.currentDeployment,
      success: this.currentDeployment !== null,
      log: this.deploymentLog
    };

    fs.writeFileSync('deployment-report.json', JSON.stringify(report, null, 2));
    
    this.log('\n📋 Deployment Summary');
    this.log('=' .repeat(50));
    this.log(`Duration: ${Math.round(duration / 1000)} seconds`);
    this.log(`Previous: ${this.previousDeployment || 'None'}`);
    this.log(`Current: ${this.currentDeployment || 'Failed'}`);
    this.log(`Status: ${report.success ? '✅ SUCCESS' : '❌ FAILED'}`);
    this.log('\n💾 Full report saved to: deployment-report.json');
  }

  async run() {
    this.log('🚀 Starting production deployment process...');
    this.log(`Project: The Bigger Boss Website`);
    this.log(`Mode: ${this.isRollbackMode ? 'ROLLBACK' : 'DEPLOYMENT'}`);

    try {
      if (this.isRollbackMode) {
        await this.getCurrentDeployment();
        const rollbackSuccess = await this.rollback();
        
        if (!rollbackSuccess) {
          this.log('❌ Rollback failed - manual intervention required', 'error');
          process.exit(1);
        }
        
        this.log('✅ Rollback completed successfully');
        process.exit(0);
      }

      // Normal deployment process
      
      // Phase 1: Pre-deployment validation
      await this.getCurrentDeployment();
      
      const testsPass = await this.runTests();
      if (!testsPass) {
        this.log('❌ Deployment aborted due to test failures', 'error');
        process.exit(1);
      }

      // Phase 2: Deploy to Vercel
      const deploySuccess = await this.deployToVercel();
      if (!deploySuccess) {
        this.log('❌ Deployment failed', 'error');
        process.exit(1);
      }

      // Phase 3: Update domain alias
      const aliasSuccess = await this.updateDomainAlias();
      if (!aliasSuccess) {
        this.log('⚠️ Deployment successful but alias update failed', 'warn');
        this.log('🔄 Consider manual alias update or rollback', 'warn');
      }

      // Phase 4: Validate deployment
      const validationSuccess = await this.validateDeployment();
      if (!validationSuccess) {
        this.log('❌ Production validation failed - initiating rollback', 'error');
        await this.rollback();
        process.exit(1);
      }

      // Phase 5: Setup monitoring
      await this.setupMonitoring();

      this.log('🎉 Deployment completed successfully!');
      this.log('📋 Next steps:');
      this.log('  1. Monitor system health for 2 hours');
      this.log('  2. Verify analytics are tracking correctly');
      this.log('  3. Notify stakeholders of successful deployment');
      this.log('  4. Begin post-launch KPI monitoring');

    } catch (error) {
      this.log(`❌ Deployment error: ${error.message}`, 'error');
      this.log('🔄 Consider rollback if issues persist', 'error');
      process.exit(1);
    } finally {
      this.generateDeploymentReport();
    }
  }
}

// Handle command line arguments
const deployer = new ProductionDeployer();

process.on('SIGINT', () => {
  deployer.log('⚠️ Deployment interrupted by user', 'warn');
  deployer.generateDeploymentReport();
  process.exit(1);
});

process.on('uncaughtException', (error) => {
  deployer.log(`❌ Uncaught exception: ${error.message}`, 'error');
  deployer.generateDeploymentReport();
  process.exit(1);
});

// Run deployment
deployer.run();