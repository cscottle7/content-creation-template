import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'The Bigger Boss - AI Content Strategist for Australian SMBs',
  description: 'Level the playing field against your largest competitors with automated AI content strategy. Turn your website into a powerful engine for growth.',
}

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <section className="hero bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Turn Your Website Into a <span className="text-blue-600">Powerful Engine</span> for Growth
          </h1>
          <p className="text-xl text-gray-700 mb-8 max-w-3xl mx-auto">
            Level the playing field against your largest competitors with AI-powered content strategy. 
            Get strategically superior content that attracts the right audience and drives real results.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors">
              Start Free Trial
            </button>
            <button className="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-50 transition-colors">
              See How It Works
            </button>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Your Secret Weapon Against Bigger Competitors
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Strategic Analysis</h3>
              <p className="text-gray-600">
                Deep competitor analysis and audience research to identify your unique competitive advantages
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Automated Creation</h3>
              <p className="text-gray-600">
                AI agents work in parallel to research, strategize, and create high-quality content blueprints
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📈</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Proven Results</h3>
              <p className="text-gray-600">
                Content engineered to rank higher, attract qualified traffic, and convert visitors into customers
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}