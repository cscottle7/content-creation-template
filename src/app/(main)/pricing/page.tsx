import { Metadata } from 'next'
import { StructuredData } from '@/components/seo/StructuredData'
import { generateMetadata, generateBreadcrumbSchema, pageSEOConfigs } from '@/lib/seo'

export const metadata: Metadata = generateMetadata(pageSEOConfigs.pricing)

export default function PricingPage() {
  return (
    <div className="container mx-auto px-6 py-16">
      {/* Structured Data for SEO */}
      <StructuredData data={generateBreadcrumbSchema([
        { name: "Home", url: "/" },
        { name: "Pricing", url: "/pricing" }
      ])} />
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Choose Your Plan</h1>
          <p className="text-xl text-gray-600">
            Transparent pricing designed to deliver exceptional ROI for your content strategy
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {/* Starter Plan */}
          <div className="border border-gray-200 rounded-lg p-8 hover:shadow-lg transition-shadow">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Starter</h2>
              <div className="text-4xl font-bold text-blue-600 mb-2">$297</div>
              <p className="text-gray-600">per month</p>
            </div>
            
            <ul className="space-y-3 mb-8">
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Up to 5 content pieces per month
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Basic competitor analysis
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Keyword research & optimization
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Email support
              </li>
            </ul>
            
            <button className="w-full bg-gray-100 text-gray-900 py-3 px-6 rounded-lg font-semibold hover:bg-gray-200 transition-colors">
              Start Free Trial
            </button>
          </div>
          
          {/* Professional Plan */}
          <div className="border-2 border-blue-500 rounded-lg p-8 relative hover:shadow-lg transition-shadow">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                Most Popular
              </span>
            </div>
            
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Professional</h2>
              <div className="text-4xl font-bold text-blue-600 mb-2">$597</div>
              <p className="text-gray-600">per month</p>
            </div>
            
            <ul className="space-y-3 mb-8">
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Up to 15 content pieces per month
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Advanced competitor intelligence
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Deep audience research
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Content performance tracking
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Priority support
              </li>
            </ul>
            
            <button className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
              Start Free Trial
            </button>
          </div>
          
          {/* Enterprise Plan */}
          <div className="border border-gray-200 rounded-lg p-8 hover:shadow-lg transition-shadow">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Enterprise</h2>
              <div className="text-4xl font-bold text-blue-600 mb-2">$1,197</div>
              <p className="text-gray-600">per month</p>
            </div>
            
            <ul className="space-y-3 mb-8">
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Unlimited content pieces
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Custom brand strategy integration
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Multi-market analysis
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                API access
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Dedicated account manager
              </li>
            </ul>
            
            <button className="w-full bg-gray-100 text-gray-900 py-3 px-6 rounded-lg font-semibold hover:bg-gray-200 transition-colors">
              Contact Sales
            </button>
          </div>
        </div>
        
        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">All plans include a 14-day free trial. No credit card required.</p>
          <p className="text-sm text-gray-500">
            Cancel anytime. Pricing excludes GST for Australian businesses.
          </p>
        </div>
      </div>
    </div>
  )
}