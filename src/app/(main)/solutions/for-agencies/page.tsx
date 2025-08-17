import { Metadata } from 'next'
import { AnimatedSection } from '@/components/features/AnimatedSection'
import { AnimatedButton } from '@/components/features/AnimatedButton'
import { TestimonialsSection } from '@/components/features/TestimonialCard'
import { FAQ } from '@/components/ui/FAQ'
import { StructuredData } from '@/components/seo/StructuredData'
import { generateMetadata, generateServiceSchema, generateFAQSchema, generateBreadcrumbSchema, pageSEOConfigs } from '@/lib/seo'
import { agencyTestimonials } from '@/lib/testimonials'

export const metadata: Metadata = generateMetadata(pageSEOConfigs.agencySolutions)

const agencyFAQs = [
  {
    question: "Standard AI content tools produce generic, low-quality text. How is this different, and how can it possibly match the strategic quality of an experienced human team?",
    answer: "This is the fundamental problem The Bigger Boss was built to solve. We're not a simple content generator—we're a Content Creation Manager that replicates and enhances the workflow of an expert human strategy team. The difference lies in our process: deep strategic analysis before any research begins, parallelised multi-agent research across different strategic pillars, blueprint generation with proven content structures, and advanced quality checks including a 'Devil's Advocate' critique. The Bigger Boss acts as a powerful force multiplier for your team, automating the time-intensive research and drafting phases while allowing your human experts to focus on final refinement, creative oversight, and client relationships."
  },
  {
    question: "How can this help reduce client churn and improve retention?",
    answer: "Client churn often happens when agencies can't consistently demonstrate strategic value. The Bigger Boss helps you impress clients from day one with data-backed content blueprints that directly connect your agency's work to their commercial goals. You can deliver comprehensive, client-ready strategy reports in minutes, showcase clear competitive analysis, and provide measurable KPIs that prove ROI. This transforms you from a content production house into a strategic partner that clients can't afford to lose."
  },
  {
    question: "What's the onboarding process for new clients using this platform?",
    answer: "The Bigger Boss dramatically streamlines client onboarding. You can go from a new client brief to a comprehensive, 90-day content plan—complete with competitive analysis and topic clusters—before your first kickoff call. This creates a 'wow' factor and positions your agency as incredibly prepared and strategic from day one. The platform includes client-facing outputs and white-label reporting features, so you can present professional strategy documents with your agency branding."
  },
  {
    question: "How does the team collaboration and project management work?",
    answer: "Our Agency plan includes built-in approval workflows and team permissions to maintain quality control across your agency. You can organize and track content strategies across multiple client accounts with dedicated project workspaces. Multiple team members can collaborate on strategies, with different permission levels for junior team members versus senior strategists. This ensures consistent quality while allowing you to scale without proportionally increasing senior staff headcount."
  },
  {
    question: "What kind of time savings can we realistically expect?",
    answer: "Our agency customers typically save 8+ hours per content piece on strategic research and planning. For an agency creating 20 content pieces per month at an average billable rate of $150/hour, that translates to approximately $24,000 in monthly time savings. This allows you to either increase profitability on existing clients or take on more clients without hiring additional senior staff. The platform pays for itself many times over in operational efficiency alone."
  },
  {
    question: "How do we maintain our agency's unique strategic approach and methodology?",
    answer: "The Bigger Boss enhances rather than replaces your agency's strategic thinking. You can customize the platform with your own strategic frameworks, add your proprietary research data, and maintain your unique positioning. The platform handles the time-intensive data gathering and analysis, while your team focuses on the high-value strategic interpretation and client-specific customization that differentiates your agency."
  },
  {
    question: "What's included in the white-label reporting and client deliverables?",
    answer: "The Agency plan includes professional, client-ready strategy reports with your agency branding. These include comprehensive competitive analysis, strategic keyword portfolios, content calendar recommendations, topic cluster maps, and clear KPI frameworks for measuring success. All outputs are designed to showcase your agency's strategic expertise and can be delivered directly to clients as premium consulting deliverables."
  },
  {
    question: "Can we integrate this with our existing tech stack and workflows?",
    answer: "Yes, The Bigger Boss is designed to work seamlessly with your existing agency tools. We integrate with popular project management platforms, analytics tools, and reporting systems. The platform complements rather than replaces your current workflow, fitting into your existing client delivery process while dramatically reducing the time spent on strategic research and planning phases."
  }
]

export default function AgencySolutionsPage() {
  return (
    <div className="min-h-screen">
      {/* Structured Data for SEO */}
      <StructuredData data={generateServiceSchema({
        name: "AI Content Strategy for Marketing Agencies",
        description: "Scale your marketing agency with AI-powered content strategy automation and client-ready strategic blueprints",
        serviceType: "Content Marketing Strategy",
        offers: {
          description: "Custom onboarding included with 30-day money-back guarantee",
          priceCurrency: "AUD"
        }
      })} />
      <StructuredData data={generateFAQSchema(agencyFAQs)} />
      <StructuredData data={generateBreadcrumbSchema([
        { name: "Home", url: "/" },
        { name: "Solutions", url: "/solutions" },
        { name: "For Agencies", url: "/solutions/for-agencies" }
      ])} />
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-50 to-blue-50 py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <AnimatedSection delay={0.2}>
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                Scale Your Agency with <span className="text-purple-600">AI-Powered Strategy</span>
              </h1>
            </AnimatedSection>
            <AnimatedSection delay={0.4}>
              <p className="text-xl text-gray-700 mb-8">
                Multiply your content production capacity without sacrificing quality. 
                Let AI handle the research and drafting while your team focuses on client relationships.
              </p>
            </AnimatedSection>
            <AnimatedSection delay={0.6} className="flex flex-col sm:flex-row gap-4 justify-center">
              <AnimatedButton className="bg-purple-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-purple-700 transition-colors" delay={0.8}>
                Schedule Demo
              </AnimatedButton>
              <AnimatedButton className="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-50 transition-colors" delay={1.0}>
                View Agency Case Study
              </AnimatedButton>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Value Proposition */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              Transform Your Agency Operations
            </h2>
            
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-6">
                  Stop Trading Time for Money
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center mr-3 mt-1">
                      <span className="text-purple-600 text-sm">✓</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Increase Capacity 5x</h4>
                      <p className="text-gray-600">Handle more clients without hiring more writers</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center mr-3 mt-1">
                      <span className="text-purple-600 text-sm">✓</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Maintain Premium Quality</h4>
                      <p className="text-gray-600">Deliver strategically superior content that justifies your rates</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center mr-3 mt-1">
                      <span className="text-purple-600 text-sm">✓</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Focus on Strategy</h4>
                      <p className="text-gray-600">Let your team focus on high-value client strategy and relationships</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 p-8 rounded-lg">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">ROI Calculator</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Time saved per content piece:</span>
                    <span className="font-semibold">8 hours</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Average hourly rate:</span>
                    <span className="font-semibold">$150</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Content pieces per month:</span>
                    <span className="font-semibold">20</span>
                  </div>
                  <hr className="border-gray-300" />
                  <div className="flex justify-between text-lg font-bold text-purple-600">
                    <span>Monthly savings:</span>
                    <span>$24,000</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features for Agencies */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Built for Agency Workflows
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-xl">🔄</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Multi-Client Management</h3>
              <p className="text-gray-600">
                Organize and track content strategies across multiple client accounts 
                with dedicated project workspaces.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-xl">👥</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Team Collaboration</h3>
              <p className="text-gray-600">
                Built-in approval workflows and team permissions to maintain 
                quality control across your agency.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-xl">📊</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">White-Label Reports</h3>
              <p className="text-gray-600">
                Generate professional strategy reports with your agency branding 
                to showcase your expertise to clients.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Agency Testimonials */}
      <TestimonialsSection 
        testimonials={agencyTestimonials.slice(0, 3)}
        title="Leading Agencies Are Scaling Fast"
        description="See how Australian marketing agencies are using our platform to multiply their capacity and deliver better results"
      />

      {/* FAQ Section */}
      <FAQ 
        title="Agency-Specific Questions"
        description="Everything you need to know about scaling your agency with AI-powered content strategy"
        items={agencyFAQs}
        className="bg-gray-50"
      />

      {/* CTA Section */}
      <section className="py-16 bg-purple-600">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Scale Your Agency?
          </h2>
          <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
            Join leading Australian agencies who've transformed their operations 
            with AI-powered content strategy.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-purple-600 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors">
              Schedule Demo
            </button>
            <button className="border border-purple-300 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-purple-700 transition-colors">
              Start Free Trial
            </button>
          </div>
          <p className="text-purple-100 mt-4">Custom onboarding included • 30-day money-back guarantee</p>
        </div>
      </section>
    </div>
  )
}