/**
 * User Acceptance Testing (UAT) Framework
 * Simulates testing with persona representatives based on established user personas
 * 
 * Personas:
 * - Samira (SMB Owner): Time-pressed, needs simple solutions, focused on ROI
 * - David (Agency Manager): Detail-oriented, needs scalability, focused on client results
 * 
 * Testing Areas:
 * - User journey completion
 * - Content relevance and clarity
 * - Feature usability and accessibility
 * - Value proposition alignment
 * - Trust and credibility indicators
 */

const { chromium } = require('playwright');
const fs = require('fs');

const TEST_URL = 'http://localhost:3003';

// User persona definitions
const personas = {
  samira: {
    name: 'Samira (SMB Owner)',
    profile: 'Small business owner, time-pressed, values simplicity and clear ROI',
    primaryGoals: ['understand_value', 'quick_signup', 'trust_indicators'],
    journeyPaths: [
      { name: 'Homepage to SMB Solutions', start: '/', target: '/solutions/for-smbs' },
      { name: 'SMB Solutions to Lead Magnet', start: '/solutions/for-smbs', target: '/lead-magnets/smb-content-guide' },
      { name: 'Lead Magnet Conversion', start: '/lead-magnets/smb-content-guide', action: 'form_submit' }
    ],
    successCriteria: {
      valueClarity: 'Clear ROI messaging, simple language, no jargon',
      easeOfUse: 'Minimal clicks to key actions, obvious CTAs',
      trustFactors: 'Testimonials, guarantees, clear pricing'
    }
  },
  
  david: {
    name: 'David (Agency Manager)',
    profile: 'Marketing agency manager, detail-oriented, needs scalability and client results',
    primaryGoals: ['feature_depth', 'scalability_proof', 'client_results'],
    journeyPaths: [
      { name: 'Homepage to Agency Solutions', start: '/', target: '/solutions/for-agencies' },
      { name: 'Agency Solutions to Pricing', start: '/solutions/for-agencies', target: '/pricing' },
      { name: 'Pricing to Lead Magnet', start: '/pricing', target: '/lead-magnets/agency-webinar' },
      { name: 'Agency Lead Magnet Conversion', start: '/lead-magnets/agency-webinar', action: 'form_submit' }
    ],
    successCriteria: {
      featureComprehensiveness: 'Detailed feature explanations, enterprise capabilities',
      scalabilityEvidence: 'Volume handling, team features, integration options',
      resultsProof: 'Case studies, metrics, client testimonials'
    }
  }
};

// UAT test scenarios
const uatScenarios = [
  {
    id: 'persona_navigation',
    name: 'Persona-Specific Navigation Flow',
    description: 'Test if each persona can easily navigate to their relevant content',
    personas: ['samira', 'david']
  },
  {
    id: 'value_comprehension',
    name: 'Value Proposition Understanding',
    description: 'Evaluate if the value proposition is clear and compelling for each persona',
    personas: ['samira', 'david']
  },
  {
    id: 'conversion_completion',
    name: 'Lead Magnet Conversion Process',
    description: 'Test the complete conversion funnel for lead magnets',
    personas: ['samira', 'david']
  },
  {
    id: 'content_relevance',
    name: 'Content Relevance and Clarity',
    description: 'Assess if content speaks to persona pain points and goals',
    personas: ['samira', 'david']
  },
  {
    id: 'trust_credibility',
    name: 'Trust and Credibility Assessment',
    description: 'Evaluate trust indicators and credibility elements',
    personas: ['samira', 'david']
  }
];

class UserAcceptanceTester {
  constructor() {
    this.results = [];
    this.personaFeedback = {};
  }

  async runUserAcceptanceTests() {
    console.log('👥 Starting User Acceptance Testing (UAT)...\n');
    console.log('📋 Testing with persona representatives:');
    console.log('   • Samira (SMB Owner) - Simplicity & ROI focused');
    console.log('   • David (Agency Manager) - Features & scalability focused\n');
    
    const browser = await chromium.launch({ headless: true });
    
    try {
      for (const scenario of uatScenarios) {
        console.log(`🧪 Testing Scenario: ${scenario.name}`);
        
        for (const personaId of scenario.personas) {
          const persona = personas[personaId];
          console.log(`  👤 ${persona.name} perspective...`);
          
          const result = await this.testScenarioForPersona(browser, scenario, persona);
          this.results.push({
            scenario: scenario.id,
            scenarioName: scenario.name,
            persona: personaId,
            personaName: persona.name,
            ...result
          });
        }
      }
      
      // Generate persona-specific feedback
      await this.generatePersonaFeedback(browser);
      
    } finally {
      await browser.close();
    }
    
    this.generateUATReport();
  }

  async testScenarioForPersona(browser, scenario, persona) {
    const context = await browser.newContext({ viewport: { width: 1920, height: 1080 } });
    const page = await context.newPage();
    
    try {
      let overallScore = 0;
      let testResults = {};
      
      switch (scenario.id) {
        case 'persona_navigation':
          testResults = await this.testPersonaNavigation(page, persona);
          break;
          
        case 'value_comprehension':
          testResults = await this.testValueComprehension(page, persona);
          break;
          
        case 'conversion_completion':
          testResults = await this.testConversionCompletion(page, persona);
          break;
          
        case 'content_relevance':
          testResults = await this.testContentRelevance(page, persona);
          break;
          
        case 'trust_credibility':
          testResults = await this.testTrustCredibility(page, persona);
          break;
      }
      
      // Calculate overall scenario score
      if (testResults.scores) {
        overallScore = Object.values(testResults.scores).reduce((sum, score) => sum + score, 0) / Object.keys(testResults.scores).length;
      }
      
      return {
        success: true,
        overallScore: Math.round(overallScore),
        testResults,
        timestamp: new Date().toISOString()
      };
      
    } catch (error) {
      console.error(`    ❌ Error testing ${scenario.name} for ${persona.name}:`, error.message);
      return {
        success: false,
        error: error.message,
        timestamp: new Date().toISOString()
      };
    } finally {
      await context.close();
    }
  }

  async testPersonaNavigation(page, persona) {
    const navigationTests = [];
    
    for (const journey of persona.journeyPaths) {
      try {
        // Start journey
        await page.goto(`${TEST_URL}${journey.start}`, { waitUntil: 'networkidle' });
        
        if (journey.target) {
          // Test navigation to target
          const targetLink = await page.locator(`a[href="${journey.target}"], a[href*="${journey.target.split('/').pop()}"]`).count();
          const navigationSuccess = targetLink > 0;
          
          if (navigationSuccess) {
            await page.click(`a[href="${journey.target}"], a[href*="${journey.target.split('/').pop()}"]`);
            await page.waitForURL(`**${journey.target}`, { timeout: 5000 });
          }
          
          navigationTests.push({
            journey: journey.name,
            success: navigationSuccess,
            details: `${targetLink} navigation links found`
          });
        }
        
        if (journey.action === 'form_submit') {
          // Test form interaction
          const formExists = await page.locator('form').count() > 0;
          const submitButtonExists = await page.locator('button[type="submit"]').count() > 0;
          
          navigationTests.push({
            journey: journey.name,
            success: formExists && submitButtonExists,
            details: `Form: ${formExists}, Submit: ${submitButtonExists}`
          });
        }
        
      } catch (error) {
        navigationTests.push({
          journey: journey.name,
          success: false,
          details: `Navigation failed: ${error.message}`
        });
      }
    }
    
    const successfulNavigations = navigationTests.filter(t => t.success).length;
    const navigationScore = Math.round((successfulNavigations / navigationTests.length) * 100);
    
    return {
      scores: { navigation: navigationScore },
      details: navigationTests,
      feedback: navigationScore >= 80 ? 
        `${persona.name} can easily navigate through their intended user journey` :
        `${persona.name} may face difficulties in navigation - consider improving link visibility and placement`
    };
  }

  async testValueComprehension(page, persona) {
    // Test on persona-specific solution page
    const targetPage = persona.name.includes('SMB') ? '/solutions/for-smbs' : '/solutions/for-agencies';
    await page.goto(`${TEST_URL}${targetPage}`, { waitUntil: 'networkidle' });
    
    const valueTests = {
      clearHeadline: false,
      benefitsListed: false,
      painPointsAddressed: false,
      ctaVisibility: false,
      pricingClarity: false
    };
    
    // Check for clear headline
    const headlines = await page.locator('h1').count();
    valueTests.clearHeadline = headlines > 0;
    
    // Check for benefits/features
    const benefits = await page.locator('[class*="benefit"], [class*="feature"], li, .space-y-3 > div').count();
    valueTests.benefitsListed = benefits >= 3;
    
    // Check for pain points mentioned
    const painPointKeywords = persona.name.includes('SMB') ? 
      ['competitor', 'small business', 'limited time', 'budget'] :
      ['scale', 'client', 'agency', 'team', 'efficiency'];
    
    let painPointMentions = 0;
    for (const keyword of painPointKeywords) {
      const mentions = await page.locator(`text=${keyword}`).count();
      painPointMentions += mentions;
    }
    valueTests.painPointsAddressed = painPointMentions >= 2;
    
    // Check CTA visibility
    const ctas = await page.locator('button, a[class*="button"]').count();
    valueTests.ctaVisibility = ctas >= 2;
    
    // Check pricing/value information
    const pricingMentions = await page.locator('text=/price|pricing|cost|\\$|value|ROI/i').count();
    valueTests.pricingClarity = pricingMentions > 0;
    
    const valueScore = Math.round((Object.values(valueTests).filter(Boolean).length / Object.keys(valueTests).length) * 100);
    
    return {
      scores: { valueComprehension: valueScore },
      details: valueTests,
      feedback: valueScore >= 80 ?
        `Value proposition is clear and compelling for ${persona.name}` :
        `Value proposition needs improvement for ${persona.name} - consider highlighting specific benefits and addressing pain points more directly`
    };
  }

  async testConversionCompletion(page, persona) {
    const leadMagnetPage = persona.name.includes('SMB') ? 
      '/lead-magnets/smb-content-guide' : 
      '/lead-magnets/agency-webinar';
    
    await page.goto(`${TEST_URL}${leadMagnetPage}`, { waitUntil: 'networkidle' });
    
    const conversionTests = {
      formPresent: false,
      requiredFieldsReasonable: false,
      submitButtonClear: false,
      valuePropositionStrong: false,
      trustIndicators: false
    };
    
    // Check form presence
    const formCount = await page.locator('form').count();
    conversionTests.formPresent = formCount > 0;
    
    // Check required fields (should be minimal for better conversion)
    const requiredFields = await page.locator('input[required], select[required], textarea[required]').count();
    conversionTests.requiredFieldsReasonable = requiredFields <= 3; // Max 3 required fields
    
    // Check submit button clarity
    const submitButton = await page.locator('button[type="submit"]').first();
    if (await submitButton.count() > 0) {
      const buttonText = await submitButton.textContent();
      conversionTests.submitButtonClear = buttonText && buttonText.length > 3 && !buttonText.toLowerCase().includes('submit');
    }
    
    // Check value proposition strength
    const valueKeywords = ['free', 'download', 'guide', 'webinar', 'exclusive', 'bonus'];
    let valueKeywordCount = 0;
    for (const keyword of valueKeywords) {
      const count = await page.locator(`text=${keyword}`).count();
      valueKeywordCount += count;
    }
    conversionTests.valuePropositionStrong = valueKeywordCount >= 3;
    
    // Check trust indicators
    const trustElements = await page.locator('[class*="guarantee"], [class*="trust"], [class*="secure"], [class*="testimonial"]').count();
    const securityMentions = await page.locator('text=/secure|privacy|safe|protected/i').count();
    conversionTests.trustIndicators = trustElements > 0 || securityMentions > 0;
    
    const conversionScore = Math.round((Object.values(conversionTests).filter(Boolean).length / Object.keys(conversionTests).length) * 100);
    
    return {
      scores: { conversionCompletion: conversionScore },
      details: conversionTests,
      feedback: conversionScore >= 80 ?
        `Conversion process is optimized for ${persona.name}` :
        `Conversion process needs optimization for ${persona.name} - consider reducing form friction and strengthening trust indicators`
    };
  }

  async testContentRelevance(page, persona) {
    const targetPage = persona.name.includes('SMB') ? '/solutions/for-smbs' : '/solutions/for-agencies';
    await page.goto(`${TEST_URL}${targetPage}`, { waitUntil: 'networkidle' });
    
    const contentTests = {
      personaLanguage: false,
      specificBenefits: false,
      realWorldExamples: false,
      appropriateDepth: false
    };
    
    // Check for persona-appropriate language
    const personaKeywords = persona.name.includes('SMB') ?
      ['small business', 'owner', 'entrepreneur', 'simple', 'affordable'] :
      ['agency', 'client', 'scale', 'team', 'professional', 'enterprise'];
    
    let personaLanguageCount = 0;
    for (const keyword of personaKeywords) {
      const count = await page.locator(`text=${keyword}`).count();
      personaLanguageCount += count;
    }
    contentTests.personaLanguage = personaLanguageCount >= 3;
    
    // Check for specific benefits
    const benefitSections = await page.locator('[class*="benefit"], .space-y-3 > div, ul li').count();
    contentTests.specificBenefits = benefitSections >= 4;
    
    // Check for examples/use cases
    const exampleKeywords = ['example', 'case', 'story', 'client', 'business', 'result'];
    let exampleCount = 0;
    for (const keyword of exampleKeywords) {
      const count = await page.locator(`text=${keyword}`).count();
      exampleCount += count;
    }
    contentTests.realWorldExamples = exampleCount >= 2;
    
    // Check content depth (word count proxy)
    const textContent = await page.textContent('main');
    const wordCount = textContent ? textContent.split(' ').length : 0;
    
    if (persona.name.includes('SMB')) {
      // SMBs prefer concise content
      contentTests.appropriateDepth = wordCount >= 300 && wordCount <= 800;
    } else {
      // Agencies want more detail
      contentTests.appropriateDepth = wordCount >= 500 && wordCount <= 1200;
    }
    
    const contentScore = Math.round((Object.values(contentTests).filter(Boolean).length / Object.keys(contentTests).length) * 100);
    
    return {
      scores: { contentRelevance: contentScore },
      details: { ...contentTests, wordCount },
      feedback: contentScore >= 80 ?
        `Content is highly relevant and appropriate for ${persona.name}` :
        `Content relevance could be improved for ${persona.name} - consider adjusting language, depth, and examples`
    };
  }

  async testTrustCredibility(page, persona) {
    // Test across multiple pages for comprehensive trust assessment
    const pagesToTest = ['/', '/about', '/pricing'];
    const trustElements = {
      testimonials: 0,
      guarantees: 0,
      securityMentions: 0,
      companyInfo: 0,
      socialProof: 0
    };
    
    for (const pagePath of pagesToTest) {
      await page.goto(`${TEST_URL}${pagePath}`, { waitUntil: 'networkidle' });
      
      // Count testimonials
      trustElements.testimonials += await page.locator('[class*="testimonial"], [class*="review"], blockquote').count();
      
      // Count guarantees
      trustElements.guarantees += await page.locator('text=/guarantee|money back|risk free|satisfaction/i').count();
      
      // Count security mentions
      trustElements.securityMentions += await page.locator('text=/secure|ssl|privacy|encrypted|safe/i').count();
      
      // Count company information
      trustElements.companyInfo += await page.locator('text=/contact|about|team|company|address/i').count();
      
      // Count social proof
      trustElements.socialProof += await page.locator('[class*="social"], text=/customer|client|business|used by/i').count();
    }
    
    const trustTests = {
      hasTestimonials: trustElements.testimonials >= 2,
      hasGuarantees: trustElements.guarantees >= 1,
      hasSecurityInfo: trustElements.securityMentions >= 1,
      hasCompanyInfo: trustElements.companyInfo >= 3,
      hasSocialProof: trustElements.socialProof >= 2
    };
    
    const trustScore = Math.round((Object.values(trustTests).filter(Boolean).length / Object.keys(trustTests).length) * 100);
    
    return {
      scores: { trustCredibility: trustScore },
      details: { ...trustTests, counts: trustElements },
      feedback: trustScore >= 80 ?
        `Trust and credibility indicators are strong for ${persona.name}` :
        `Trust and credibility could be strengthened for ${persona.name} - consider adding more testimonials, guarantees, and social proof`
    };
  }

  async generatePersonaFeedback(browser) {
    console.log('\n💬 Generating Detailed Persona Feedback...');
    
    const context = await browser.newContext();
    const page = await context.newPage();
    
    try {
      for (const [personaId, persona] of Object.entries(personas)) {
        console.log(`  👤 Analyzing ${persona.name} experience...`);
        
        const personaResults = this.results.filter(r => r.persona === personaId);
        const avgScore = personaResults.reduce((sum, r) => sum + (r.overallScore || 0), 0) / personaResults.length;
        
        // Generate comprehensive feedback
        const feedback = {
          overallScore: Math.round(avgScore),
          strengths: [],
          improvements: [],
          priorities: [],
          userSatisfaction: avgScore >= 80 ? 'High' : avgScore >= 60 ? 'Medium' : 'Low'
        };
        
        // Analyze strengths and improvements
        personaResults.forEach(result => {
          if (result.testResults?.feedback) {
            if (result.overallScore >= 80) {
              feedback.strengths.push(result.testResults.feedback);
            } else {
              feedback.improvements.push(result.testResults.feedback);
            }
          }
        });
        
        // Generate priorities based on persona goals
        if (avgScore < 80) {
          if (persona.name.includes('SMB')) {
            feedback.priorities = [
              'Simplify value proposition messaging',
              'Reduce form complexity for lead magnets',
              'Strengthen ROI and time-saving messaging',
              'Add more small business testimonials'
            ];
          } else {
            feedback.priorities = [
              'Provide more detailed feature information',
              'Add enterprise-level case studies',
              'Strengthen scalability messaging',
              'Include team collaboration features'
            ];
          }
        }
        
        this.personaFeedback[personaId] = feedback;
      }
    } finally {
      await context.close();
    }
  }

  generateUATReport() {
    console.log('\n👥 User Acceptance Testing Report');
    console.log('=' .repeat(50));
    
    // Overall UAT summary
    const overallScores = this.results.filter(r => r.success).map(r => r.overallScore);
    const avgScore = overallScores.reduce((sum, score) => sum + score, 0) / overallScores.length;
    
    console.log(`\n📊 Overall UAT Score: ${avgScore.toFixed(1)}%`);
    
    // Persona-specific results
    console.log('\n👤 Persona Feedback Summary:');
    
    Object.entries(this.personaFeedback).forEach(([personaId, feedback]) => {
      const persona = personas[personaId];
      const icon = feedback.overallScore >= 80 ? '✅' : feedback.overallScore >= 60 ? '⚠️' : '❌';
      
      console.log(`\n  ${icon} ${persona.name}: ${feedback.overallScore}% (${feedback.userSatisfaction} Satisfaction)`);
      
      if (feedback.strengths.length > 0) {
        console.log(`    ✅ Strengths: ${feedback.strengths.length} positive areas`);
      }
      
      if (feedback.improvements.length > 0) {
        console.log(`    🔧 Improvements needed: ${feedback.improvements.length} areas`);
      }
      
      if (feedback.priorities.length > 0) {
        console.log(`    🎯 Top priorities: ${feedback.priorities.slice(0, 2).join(', ')}`);
      }
    });
    
    // Scenario performance breakdown
    console.log('\n📋 UAT Scenario Results:');
    
    const scenarioScores = {};
    this.results.forEach(result => {
      if (!scenarioScores[result.scenarioName]) {
        scenarioScores[result.scenarioName] = [];
      }
      scenarioScores[result.scenarioName].push(result.overallScore || 0);
    });
    
    Object.entries(scenarioScores).forEach(([scenario, scores]) => {
      const avgScenarioScore = scores.reduce((sum, s) => sum + s, 0) / scores.length;
      const icon = avgScenarioScore >= 80 ? '✅' : avgScenarioScore >= 60 ? '⚠️' : '❌';
      console.log(`  ${icon} ${scenario}: ${avgScenarioScore.toFixed(1)}%`);
    });
    
    // User acceptance status
    const isUserAccepted = avgScore >= 75 && 
      Object.values(this.personaFeedback).every(f => f.overallScore >= 70);
    
    console.log(`\n🏆 User Acceptance Status: ${isUserAccepted ? '✅ ACCEPTED' : '⚠️ NEEDS IMPROVEMENT'}`);
    
    if (!isUserAccepted) {
      console.log('\n🔧 Critical UAT Actions Required:');
      console.log('  1. Address persona-specific feedback points');
      console.log('  2. Optimize conversion funnels for both user types');
      console.log('  3. Improve content relevance and clarity');
      console.log('  4. Strengthen trust and credibility indicators');
    }
    
    // Save detailed UAT report
    const report = {
      summary: {
        overallScore: parseFloat(avgScore.toFixed(1)),
        isUserAccepted,
        personaScores: Object.entries(this.personaFeedback).reduce((acc, [id, feedback]) => {
          acc[id] = feedback.overallScore;
          return acc;
        }, {}),
        timestamp: new Date().toISOString()
      },
      personaFeedback: this.personaFeedback,
      scenarioResults: this.results,
      recommendations: Object.values(this.personaFeedback).flatMap(f => f.priorities).slice(0, 5)
    };
    
    fs.writeFileSync('user-acceptance-testing-report.json', JSON.stringify(report, null, 2));
    console.log('\n💾 Detailed UAT report saved to: user-acceptance-testing-report.json');
    console.log('\n🎉 User acceptance testing completed!');
    
    return report;
  }
}

// Run UAT
async function main() {
  const tester = new UserAcceptanceTester();
  await tester.runUserAcceptanceTests();
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = UserAcceptanceTester;