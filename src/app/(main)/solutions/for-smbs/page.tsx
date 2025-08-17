import { Metadata } from 'next'
import { AnimatedSection } from '@/components/features/AnimatedSection'
import { AnimatedCard } from '@/components/features/AnimatedCard'
import { AnimatedButton } from '@/components/features/AnimatedButton'
import { TestimonialsSection } from '@/components/features/TestimonialCard'
import { FAQ } from '@/components/ui/FAQ'
import { StructuredData } from '@/components/seo/StructuredData'
import { generateMetadata, generateServiceSchema, generateFAQSchema, generateBreadcrumbSchema, pageSEOConfigs } from '@/lib/seo'
import { smbTestimonials } from '@/lib/testimonials'

export const metadata: Metadata = generateMetadata(pageSEOConfigs.smbSolutions)

const smbFAQs = [
  {
    question: "This sounds powerful, but is it too complicated for me? Do I need to be an SEO expert to get results?",
    answer: "Not at all. The Bigger Boss was designed specifically to handle the complexity for you. Your role is to provide simple inputs about your business—your brand name, website, and your primary goal for the content (like 'increase online sales' or 'get more quote requests'). From there, our AI agents autonomously conduct all the deep research, analysis, and strategic planning. The final deliverable you receive is a high-quality first draft that requires only minor edits, allowing you to focus on your business while we handle the expert-level work."
  },
  {
    question: "How does this actually lead to better website performance and a positive return on investment?",
    answer: "The Bigger Boss is designed around improving performance and delivering strong ROI in two main ways: First, increased content effectiveness—because every piece of content is born from deep strategic analysis of your specific brand, audience, and competitive landscape, it's inherently more targeted and relevant. Second, drastic operational efficiency—you save dozens of hours of your own time that would otherwise be spent researching, planning, and guessing what content to create."
  },
  {
    question: "What exactly will I receive when I use The Bigger Boss?",
    answer: "You'll receive a comprehensive Content Strategy Blueprint that includes: a deep competitor analysis showing exactly what your competitors are doing wrong, a strategic keyword plan targeting topics your customers are actually searching for, specific article ideas mapped to your customer journey, and a 90-day content calendar with titles, outlines, and publishing recommendations. Think of it as having a marketing strategist create your entire content plan."
  },
  {
    question: "How is this different from other AI writing tools I've seen?",
    answer: "Most AI tools focus on writing—they help you create content faster but don't tell you WHAT to write about or WHY. The Bigger Boss focuses on strategy first. Instead of generating random articles, we analyze your business goals, study your competitors, research your audience's real search behavior, and then create a strategic plan that connects your content directly to business results. We're not just an AI writer—we're your AI strategist."
  },
  {
    question: "I'm already overwhelmed with running my business. How much time will this take?",
    answer: "That's exactly why we built this. Initial setup takes about 15 minutes to input your business details and goals. After that, generating a complete content strategy takes our AI about 10 minutes. Compare that to the weeks you'd spend researching competitors, analyzing keywords, and planning content manually. Most customers save 20-30 hours per month and get better results because the strategy is data-driven, not guesswork."
  },
  {
    question: "What if I'm not tech-savvy? Will I be able to use this?",
    answer: "Absolutely. We designed The Bigger Boss for business owners, not tech experts. The interface is simple and guided—just answer a few questions about your business and goals, and our AI does the heavy lifting. We also provide step-by-step video tutorials and email support to help you get the most out of your content strategy. If you can use email, you can use The Bigger Boss."
  },
  {
    question: "Can I try it before committing to a paid plan?",
    answer: "Yes! We offer a 14-day free trial with no credit card required. You can generate your first complete content strategy blueprint and see exactly how it works for your business. We're confident that once you see the quality and depth of insights, you'll understand why this is different from any other content tool you've tried."
  }
]

export default function SMBSolutionsPage() {
  return (
    <div className="min-h-screen">
      {/* Structured Data for SEO */}
      <StructuredData data={generateServiceSchema({
        name: "AI Content Strategy for Small Businesses",
        description: "AI-powered content strategy platform designed for Australian small and medium businesses to compete with larger competitors",
        serviceType: "Content Marketing Strategy",
        offers: {
          description: "14-day free trial with no credit card required",
          priceCurrency: "AUD",
          price: "0"
        }
      })} />
      <StructuredData data={generateFAQSchema(smbFAQs)} />
      <StructuredData data={generateBreadcrumbSchema([
        { name: "Home", url: "/" },
        { name: "Solutions", url: "/solutions" },
        { name: "For SMBs", url: "/solutions/for-smbs" }
      ])} />
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-50 to-blue-50 py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <AnimatedSection delay={0.2}>
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                Finally Compete with the <span className="text-green-600">Big Players</span>
              </h1>
            </AnimatedSection>
            <AnimatedSection delay={0.4}>
              <p className="text-xl text-gray-700 mb-8">
                Stop losing customers to larger competitors who dominate search results. 
                Get strategically superior content that gives you an unfair advantage.
              </p>
            </AnimatedSection>
            <AnimatedSection delay={0.6} className="flex flex-col sm:flex-row gap-4 justify-center">
              <AnimatedButton className="bg-green-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-green-700 transition-colors" delay={0.8}>
                Start Free Trial
              </AnimatedButton>
              <AnimatedButton className="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-50 transition-colors" delay={1.0}>
                See SMB Success Stories
              </AnimatedButton>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <AnimatedSection>
              <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
                You Shouldn't Have to Choose Between Quality and Speed
              </h2>
            </AnimatedSection>
            
            <div className="grid md:grid-cols-2 gap-8">
              <AnimatedCard delay={0.2} className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-red-400">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">The Old Way</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• Spend weeks researching competitors</li>
                  <li>• Guess what your audience wants</li>
                  <li>• Create generic content that gets ignored</li>
                  <li>• Watch bigger companies dominate your market</li>
                  <li>• Waste time and money on content that doesn't convert</li>
                </ul>
              </AnimatedCard>
              
              <AnimatedCard delay={0.4} className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-green-400">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">The Bigger Boss Way</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• Get deep competitor analysis in minutes</li>
                  <li>• Understand exactly what your audience needs</li>
                  <li>• Receive strategically superior content blueprints</li>
                  <li>• Outrank competitors with targeted content</li>
                  <li>• Turn your website into a customer magnet</li>
                </ul>
              </AnimatedCard>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <AnimatedSection>
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              Your Secret Weapon Against Bigger Competitors
            </h2>
          </AnimatedSection>
          
          <div className="grid md:grid-cols-3 gap-8">
            <AnimatedCard index={0} className="text-center p-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Smart Market Analysis</h3>
              <p className="text-gray-600">
                Automatically discover what your competitors are missing and find the gaps 
                your business can exploit to attract more customers.
              </p>
            </AnimatedCard>
            
            <AnimatedCard index={1} className="text-center p-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Done-For-You Strategy</h3>
              <p className="text-gray-600">
                Get complete content blueprints that require minimal editing. 
                No more staring at blank pages or wondering what to write about.
              </p>
            </AnimatedCard>
            
            <AnimatedCard index={2} className="text-center p-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📈</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Proven Results</h3>
              <p className="text-gray-600">
                Content engineered to rank higher in search results, attract qualified 
                visitors, and convert them into paying customers.
              </p>
            </AnimatedCard>
          </div>
        </div>
      </section>

      {/* SMB Testimonials */}
      <TestimonialsSection 
        testimonials={smbTestimonials.slice(0, 3)}
        title="Small Businesses Are Winning Big"
        description="See how Australian SMBs are using our platform to compete with much larger competitors"
        className="bg-gray-50"
      />

      {/* FAQ Section */}
      <FAQ 
        title="Your Questions Answered"
        description="Everything you need to know about getting started with AI content strategy"
        items={smbFAQs}
        className=""
      />

      {/* CTA Section */}
      <section className="py-16 bg-green-600">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Level the Playing Field?
          </h2>
          <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
            Join hundreds of Australian SMBs who've transformed their online presence 
            with AI-powered content strategy.
          </p>
          <button className="bg-white text-green-600 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors">
            Start Your Free Trial Today
          </button>
          <p className="text-green-100 mt-4">No credit card required • 14-day free trial</p>
        </div>
      </section>
    </div>
  )
}