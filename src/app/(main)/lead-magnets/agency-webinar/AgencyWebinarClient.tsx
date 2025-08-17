'use client'

import LeadMagnetForm from '@/components/features/LeadMagnetForm'
import { useCTATracking } from '@/lib/hooks/useAnalytics'
import { PlayIcon, ClockIcon, UserGroupIcon, ChartBarIcon, LightBulbIcon, RocketLaunchIcon } from '@heroicons/react/24/outline'

export default function AgencyWebinarClient() {
  const { trackCTA } = useCTATracking()

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Content */}
            <div className="space-y-8">
              <div className="space-y-6">
                <div className="inline-flex items-center px-4 py-2 bg-red-100 text-red-800 rounded-full text-sm font-medium">
                  <ClockIcon className="w-4 h-4 mr-2" />
                  Live Webinar - Limited Seats
                </div>
                
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                  Scale Content Production
                  <span className="text-indigo-600 block">Without Sacrificing Quality</span>
                </h1>
                
                <p className="text-xl text-gray-600 leading-relaxed">
                  Join 500+ agency owners in this exclusive masterclass on building 
                  a scalable content operation that delivers premium results and increases your profitability.
                </p>
              </div>

              {/* Webinar Details */}
              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <PlayIcon className="w-6 h-6 text-indigo-600" />
                    </div>
                    <p className="text-sm font-medium text-gray-900">Duration</p>
                    <p className="text-sm text-gray-600">60 minutes</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <UserGroupIcon className="w-6 h-6 text-green-600" />
                    </div>
                    <p className="text-sm font-medium text-gray-900">Format</p>
                    <p className="text-sm text-gray-600">Live + Q&A</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <ChartBarIcon className="w-6 h-6 text-blue-600" />
                    </div>
                    <p className="text-sm font-medium text-gray-900">Value</p>
                    <p className="text-sm text-gray-600">$497 Free</p>
                  </div>
                </div>
              </div>

              {/* Key Learning Points */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-gray-900">What you'll learn:</h2>
                <div className="space-y-3">
                  {[
                    'The 5-pillar framework for scalable content operations',
                    'How to maintain premium quality while increasing output 300%',
                    'Client retention strategies through superior content delivery',
                    'Pricing models that maximize profitability per account',
                    'Team structures that support sustainable growth'
                  ].map((benefit, index) => (
                    <div key={index} className="flex items-start">
                      <LightBulbIcon className="w-5 h-5 text-yellow-600 mt-0.5 mr-3 flex-shrink-0" />
                      <span className="text-gray-700">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Form */}
            <div className="lg:pl-8" id="form">
              <LeadMagnetForm
                persona="agency"
                magnetType="webinar"
                title="Reserve Your Seat"
                description="Limited to 200 attendees for maximum interaction and value"
                className="sticky top-8"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              What Agency Leaders Are Saying
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                quote: "This framework helped us scale from 5 to 15 content clients without adding a single new hire. Our profit margins actually improved.",
                author: "Marcus Chen",
                title: "CEO, Digital Growth Partners",
                metric: "300% output increase"
              },
              {
                quote: "The pricing strategies alone paid for themselves within the first month. We're now the premium option in our market.",
                author: "Jennifer Rodriguez",
                title: "Founder, Content Collective",
                metric: "40% price increase"
              },
              {
                quote: "Client retention went from 60% to 90% after implementing these content processes. Game-changing insights.",
                author: "David Park",
                title: "Director, Apex Marketing",
                metric: "90% retention rate"
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-6">
                <p className="text-gray-600 mb-4">"{testimonial.quote}"</p>
                <div className="border-t border-gray-200 pt-4">
                  <p className="font-semibold text-gray-900">{testimonial.author}</p>
                  <p className="text-sm text-gray-600">{testimonial.title}</p>
                  <p className="text-sm font-medium text-indigo-600 mt-1">{testimonial.metric}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Urgency Section */}
      <section className="py-16 bg-red-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-white rounded-xl p-8 shadow-lg">
            <div className="flex items-center justify-center mb-6">
              <ClockIcon className="w-8 h-8 text-red-600 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900">
                Limited Seats Available
              </h2>
            </div>
            
            <p className="text-lg text-gray-600 mb-8">
              We're limiting attendance to ensure maximum interaction and value. 
              Only 47 seats remaining for this exclusive session.
            </p>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                🎁 Exclusive Bonus for Attendees
              </h3>
              <p className="text-gray-700">
                Register now and receive our "Agency Content Pricing Calculator" 
                (usually $197) absolutely free - available only to webinar attendees.
              </p>
            </div>

            <a 
              href="#form" 
              className="inline-flex items-center px-8 py-4 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
              onClick={trackCTA('register_webinar', 'urgency_cta', { persona: 'agency' })}
            >
              Reserve My Seat Now
            </a>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Don't Let Your Competitors Get Ahead
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Register now and discover the strategies that successful agencies use 
            to scale profitably while maintaining premium quality.
          </p>
          
          <a 
            href="#form" 
            className="inline-flex items-center px-8 py-4 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
            onClick={trackCTA('register_webinar', 'final_cta', { persona: 'agency' })}
          >
            Register for Free Webinar
          </a>
          
          <p className="text-sm text-gray-400 mt-4">
            Registration takes less than 60 seconds • Limited seats available
          </p>
        </div>
      </section>
    </div>
  )
}