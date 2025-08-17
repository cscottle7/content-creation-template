import { Metadata } from 'next'
import { AnimatedSection } from '@/components/features/AnimatedSection'
import { AnimatedCard } from '@/components/features/AnimatedCard'
import { Button } from '@/components/ui/Button'
import { StructuredData } from '@/components/seo/StructuredData'
import { generateMetadata, generateBreadcrumbSchema, pageSEOConfigs } from '@/lib/seo'
import Link from 'next/link'
import { Target, Users, Award, TrendingUp } from 'lucide-react'

export const metadata: Metadata = generateMetadata(pageSEOConfigs.about)

const values = [
  {
    icon: <Target className="h-8 w-8 text-primary-600" />,
    title: 'Strategic Excellence',
    description: 'Every piece of content serves a specific business objective, backed by deep market intelligence.'
  },
  {
    icon: <Users className="h-8 w-8 text-primary-600" />,
    title: 'SMB Focused',
    description: 'Purpose-built for small and medium businesses who need enterprise-level content strategy.'
  },
  {
    icon: <Award className="h-8 w-8 text-primary-600" />,
    title: 'Quality First',
    description: 'AI-powered efficiency without compromising on strategic depth or content quality.'
  },
  {
    icon: <TrendingUp className="h-8 w-8 text-primary-600" />,
    title: 'Measurable Results',
    description: 'Data-driven approach ensuring every content investment delivers quantifiable business growth.'
  }
]

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Structured Data for SEO */}
      <StructuredData data={generateBreadcrumbSchema([
        { name: "Home", url: "/" },
        { name: "About", url: "/about" }
      ])} />
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 via-white to-secondary-50 py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <AnimatedSection>
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                Leveling the Playing Field for <span className="text-primary-600">Australian Businesses</span>
              </h1>
            </AnimatedSection>
            <AnimatedSection delay={0.2}>
              <p className="text-xl text-gray-700 mb-8 leading-relaxed">
                We believe every business deserves the competitive advantage that comes with strategic, 
                high-quality content—regardless of their size or budget.
              </p>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <AnimatedSection>
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Our Mission</h2>
            </AnimatedSection>
            <AnimatedSection delay={0.2}>
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div>
                  <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                    For years, crafting deeply researched, strategically superior content was a luxury only 
                    available to businesses with large marketing budgets and dedicated teams. Small businesses 
                    watched helplessly as larger competitors dominated search results with content they simply 
                    couldn't afford to create.
                  </p>
                  <p className="text-lg text-gray-700 leading-relaxed">
                    We're changing that. The Bigger Boss democratizes access to enterprise-level content strategy, 
                    giving every Australian business the tools to compete—and win—against much larger competitors.
                  </p>
                </div>
                <div className="bg-primary-50 p-8 rounded-lg">
                  <h3 className="text-xl font-semibold text-primary-800 mb-4">The Problem We Solve</h3>
                  <ul className="space-y-3 text-primary-700">
                    <li>• 73% of SMBs can't afford professional content strategy</li>
                    <li>• 89% struggle to compete with larger competitors online</li>
                    <li>• 65% waste budget on generic content that doesn't convert</li>
                    <li>• Most AI tools produce low-quality, generic content</li>
                  </ul>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <AnimatedSection>
            <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Our Values</h2>
          </AnimatedSection>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <AnimatedCard key={index} index={index} className="text-center p-6">
                <div className="flex justify-center mb-4">
                  {value.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </AnimatedCard>
            ))}
          </div>
        </div>
      </section>

      {/* How We're Different */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <AnimatedSection>
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">How We're Different</h2>
            </AnimatedSection>
            <AnimatedSection delay={0.2}>
              <div className="prose prose-lg max-w-none">
                <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                  The Bigger Boss isn't just another AI content generator. It's a complete Content Creation Manager 
                  that replicates and enhances the workflow of an expert human strategy team. While other tools 
                  produce generic content, we deliver strategically superior content blueprints that require 
                  minimal editing and drive real business results.
                </p>
                
                <div className="bg-primary-600 text-white p-8 rounded-lg my-8">
                  <h3 className="text-xl font-semibold mb-4">Built for Australian Businesses</h3>
                  <p className="text-primary-100 leading-relaxed">
                    We understand the unique challenges facing Australian SMBs and marketing agencies. 
                    Our AI is specifically trained to create content that resonates with Australian audiences, 
                    understands local market dynamics, and addresses the specific competitive landscape 
                    that Australian businesses face.
                  </p>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary-600">
        <div className="container mx-auto px-6 text-center">
          <AnimatedSection>
            <h2 className="text-3xl font-bold text-white mb-6">
              Ready to Level the Playing Field?
            </h2>
            <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
              Join hundreds of Australian businesses who've transformed their online presence with AI-powered content strategy.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" variant="secondary" className="text-lg px-8">
                <Link href="/solutions/for-smbs">
                  For Small Businesses
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="text-lg px-8 border-white text-white hover:bg-white hover:text-primary-600">
                <Link href="/solutions/for-agencies">
                  For Agencies
                </Link>
              </Button>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  )
}