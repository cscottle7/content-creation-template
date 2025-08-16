import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About The Bigger Boss - AI Content Strategy Team',
  description: 'Learn about our mission to level the playing field for Australian SMBs with AI-powered content strategy.',
}

export default function AboutPage() {
  return (
    <div className="container mx-auto px-6 py-16">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">About The Bigger Boss</h1>
        
        <div className="prose prose-lg max-w-none">
          <p className="text-xl text-gray-700 mb-6">
            We believe every business deserves the competitive advantage that comes with strategic, 
            high-quality content - regardless of their size or budget.
          </p>
          
          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Our Mission</h2>
          <p className="text-gray-700 mb-6">
            For years, crafting deeply researched, strategically superior content was a luxury only 
            available to businesses with large marketing budgets and dedicated teams. We're changing that.
          </p>
          
          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">How We're Different</h2>
          <p className="text-gray-700 mb-6">
            The Bigger Boss isn't just another AI content generator. It's a complete Content Creation Manager 
            that replicates and enhances the workflow of an expert human strategy team, delivering strategically 
            superior content blueprints that require minimal editing.
          </p>
          
          <div className="bg-blue-50 border-l-4 border-blue-400 p-6 my-8">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">Built for Australian Businesses</h3>
            <p className="text-blue-800">
              We understand the unique challenges facing Australian SMBs and marketing agencies, 
              and our AI is trained to create content that resonates with Australian audiences and markets.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}