import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AI Content Strategy for SMBs - The Bigger Boss',
  description: 'Finally compete with the big players. Get strategically superior content that turns your website into a powerful engine for growth.',
}

export default function SMBSolutionsPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-50 to-blue-50 py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Finally Compete with the <span className="text-green-600">Big Players</span>
            </h1>
            <p className="text-xl text-gray-700 mb-8">
              Stop losing customers to larger competitors who dominate search results. 
              Get strategically superior content that gives you an unfair advantage.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-green-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-green-700 transition-colors">
                Start Free Trial
              </button>
              <button className="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-50 transition-colors">
                See SMB Success Stories
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              You Shouldn't Have to Choose Between Quality and Speed
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-red-400">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">The Old Way</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• Spend weeks researching competitors</li>
                  <li>• Guess what your audience wants</li>
                  <li>• Create generic content that gets ignored</li>
                  <li>• Watch bigger companies dominate your market</li>
                  <li>• Waste time and money on content that doesn't convert</li>
                </ul>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-green-400">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">The Bigger Boss Way</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• Get deep competitor analysis in minutes</li>
                  <li>• Understand exactly what your audience needs</li>
                  <li>• Receive strategically superior content blueprints</li>
                  <li>• Outrank competitors with targeted content</li>
                  <li>• Turn your website into a customer magnet</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Your Secret Weapon Against Bigger Competitors
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Smart Market Analysis</h3>
              <p className="text-gray-600">
                Automatically discover what your competitors are missing and find the gaps 
                your business can exploit to attract more customers.
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Done-For-You Strategy</h3>
              <p className="text-gray-600">
                Get complete content blueprints that require minimal editing. 
                No more staring at blank pages or wondering what to write about.
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📈</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Proven Results</h3>
              <p className="text-gray-600">
                Content engineered to rank higher in search results, attract qualified 
                visitors, and convert them into paying customers.
              </p>
            </div>
          </div>
        </div>
      </section>

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