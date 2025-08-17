'use client'

import LeadMagnetForm from '@/components/features/LeadMagnetForm'
import { useCTATracking } from '@/lib/hooks/useAnalytics'
import { CheckIcon, ClockIcon, ChartBarIcon, ShieldCheckIcon } from '@heroicons/react/24/outline'

export default function SMBContentGuideClient() {
  const { trackCTA } = useCTATracking()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Content */}
            <div className="space-y-8">
              <div className="space-y-6">
                <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                  <ShieldCheckIcon className="w-4 h-4 mr-2" />
                  100% Free Download
                </div>
                
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                  Stop Losing Customers to 
                  <span className="text-blue-600 block">Bigger Competitors</span>
                </h1>
                
                <p className="text-xl text-gray-600 leading-relaxed">
                  Discover the proven content strategy framework that helps small businesses 
                  compete with industry giants and turn their website into a reliable growth engine.
                </p>
              </div>

              {/* Key Benefits */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-gray-900">What you'll get:</h2>
                <div className="space-y-3">
                  {[
                    'Step-by-step content planning framework',
                    'Templates for creating customer-focused content',
                    'Simple strategies to outrank bigger competitors',
                    'Time-saving content creation workflows',
                    'Proven tactics to attract more qualified leads'
                  ].map((benefit, index) => (
                    <div key={index} className="flex items-start">
                      <CheckIcon className="w-5 h-5 text-green-600 mt-0.5 mr-3 flex-shrink-0" />
                      <span className="text-gray-700">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Social Proof */}
              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <ChartBarIcon className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">
                      "This guide helped us triple our website traffic in just 6 months. 
                      Finally, a strategy that makes sense for small businesses!"
                    </p>
                    <p className="text-sm font-medium text-gray-900 mt-1">
                      Sarah Chen, Local Bakery Owner
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Form */}
            <div className="lg:pl-8" id="form">
              <LeadMagnetForm
                persona="smb"
                magnetType="pdf"
                title="Download Your Free Guide"
                description="Get instant access to the complete content strategy guide (32 pages, PDF format)"
                className="sticky top-8"
              />
            </div>
          </div>
        </div>
      </section>

      {/* What's Inside Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              What's Inside the Guide
            </h2>
            <p className="text-lg text-gray-600">
              32 pages of actionable strategies designed specifically for small business owners
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                chapter: 'Chapter 1',
                title: 'Understanding Your Competitive Advantage',
                description: 'Discover what makes your business unique and how to communicate it effectively.',
                pages: '8 pages'
              },
              {
                chapter: 'Chapter 2',
                title: 'Content That Attracts Your Ideal Customers',
                description: 'Learn exactly what content your customers are searching for online.',
                pages: '10 pages'
              },
              {
                chapter: 'Chapter 3',
                title: 'The Small Business Content Calendar',
                description: 'A simple system to plan and create content consistently without burnout.',
                pages: '8 pages'
              },
              {
                chapter: 'Chapter 4',
                title: 'Outranking Bigger Competitors',
                description: 'Proven tactics to beat larger businesses in search results.',
                pages: '6 pages'
              }
            ].map((item, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-blue-600">{item.chapter}</span>
                  <span className="text-sm text-gray-500">{item.pages}</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Urgency Section */}
      <section className="py-16 bg-blue-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-white rounded-xl p-8 shadow-lg">
            <div className="flex items-center justify-center mb-6">
              <ClockIcon className="w-8 h-8 text-orange-600 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900">
                Don't Wait Another Day
              </h2>
            </div>
            
            <p className="text-lg text-gray-600 mb-8">
              Every day you delay is another day your competitors are getting ahead. 
              Download your free guide now and start building your competitive advantage today.
            </p>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                ⚡ Limited Time Bonus
              </h3>
              <p className="text-gray-700">
                Download now and get access to our exclusive "Quick Win Content Templates" 
                - 5 proven content formats you can use immediately.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Frequently Asked Questions
          </h2>
          
          <div className="space-y-8">
            {[
              {
                question: "Is this guide really free?",
                answer: "Yes, absolutely! This is our way of introducing you to The Bigger Boss methodology. No hidden costs or credit card required."
              },
              {
                question: "How is this different from other content marketing guides?",
                answer: "Most guides are written for enterprise companies with big budgets and teams. This guide is specifically designed for small business owners who need practical strategies they can implement themselves."
              },
              {
                question: "How long will it take to see results?",
                answer: "Many business owners see improvements in their content performance within 30 days of implementing the strategies. However, sustainable growth typically takes 3-6 months of consistent application."
              },
              {
                question: "Do I need technical skills to use this guide?",
                answer: "Not at all! The guide is written in plain English with step-by-step instructions. If you can send an email, you can implement these strategies."
              }
            ].map((faq, index) => (
              <div key={index} className="border-b border-gray-200 pb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Level the Playing Field?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of small business owners who've downloaded this guide 
            and started competing more effectively online.
          </p>
          
          <a 
            href="#form" 
            className="inline-flex items-center px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
            onClick={trackCTA('download_guide', 'final_cta', { persona: 'smb' })}
          >
            Download Your Free Guide Now
          </a>
          
          <p className="text-sm text-gray-400 mt-4">
            Download takes less than 30 seconds • No spam, ever
          </p>
        </div>
      </section>
    </div>
  )
}