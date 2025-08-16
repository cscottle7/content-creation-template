import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AI Content Strategy for Agencies - The Bigger Boss',
  description: 'Scale your agency with AI-powered content strategy. Deliver premium results faster while focusing your team on high-value client relationships.',
}

export default function AgencySolutionsPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-50 to-blue-50 py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Scale Your Agency with <span className="text-purple-600">AI-Powered Strategy</span>
            </h1>
            <p className="text-xl text-gray-700 mb-8">
              Multiply your content production capacity without sacrificing quality. 
              Let AI handle the research and drafting while your team focuses on client relationships.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-purple-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-purple-700 transition-colors">
                Schedule Demo
              </button>
              <button className="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-50 transition-colors">
                View Agency Case Study
              </button>
            </div>
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

      {/* Testimonial */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <blockquote className="text-2xl text-gray-700 italic mb-6">
              "The Bigger Boss has transformed how we deliver content strategy. We've increased 
              our client capacity by 300% while maintaining the premium quality our clients expect. 
              It's like having a senior strategist working 24/7."
            </blockquote>
            <div className="text-gray-600">
              <div className="font-semibold">Sarah Chen</div>
              <div>Director, Digital Marketing Agency Melbourne</div>
            </div>
          </div>
        </div>
      </section>

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