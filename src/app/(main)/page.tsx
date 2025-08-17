import { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { ArrowRight, CheckCircle, Zap, Target, TrendingUp, Users, Brain, Shield } from 'lucide-react';
import { AnimatedSection } from '@/components/features/AnimatedSection';
import { AnimatedCard } from '@/components/features/AnimatedCard';
import { AnimatedButton } from '@/components/features/AnimatedButton';
import { Hero3DBackground } from '@/components/features/Hero3DBackground';
import { StructuredData } from '@/components/features/StructuredData';
import { TestimonialsSection } from '@/components/features/TestimonialCard';
import { SocialProofStats } from '@/components/features/SocialProofStats';
import { generateMetadata, generateOrganizationSchema, generateWebsiteSchema, generateServiceSchema, pageSEOConfigs } from '@/lib/seo';
import { smbTestimonials, agencyTestimonials } from '@/lib/testimonials';

export const metadata: Metadata = generateMetadata(pageSEOConfigs.home);

const features = [
  {
    icon: <Brain className="h-8 w-8 text-primary-600" />,
    title: 'Strategic Analysis',
    description: 'Deep competitor analysis and audience research to identify your unique competitive advantages and market opportunities.',
  },
  {
    icon: <Zap className="h-8 w-8 text-primary-600" />,
    title: 'Automated Creation',
    description: 'AI agents work in parallel to research, strategize, and create high-quality content blueprints in minutes, not weeks.',
  },
  {
    icon: <TrendingUp className="h-8 w-8 text-primary-600" />,
    title: 'Proven Results',
    description: 'Content engineered to rank higher, attract qualified traffic, and convert visitors into paying customers.',
  },
];

const benefits = [
  '80% reduction in content planning time',
  'Strategic content aligned with business goals',
  'Competitive analysis and market positioning',
  'SEO-optimized content blueprints',
  'Multi-format content adaptation',
  'Performance tracking and optimization',
];

// Select featured testimonials - one from each persona
const featuredTestimonials = [
  smbTestimonials[0], // Sarah Chen
  agencyTestimonials[0], // David Walsh
];

export default function HomePage() {
  const organizationSchema = generateOrganizationSchema();
  const websiteSchema = generateWebsiteSchema();
  const serviceSchema = generateServiceSchema({
    name: 'AI Content Strategy Platform',
    description: 'Automated content strategy and creation platform designed specifically for Australian small and medium businesses and marketing agencies',
    serviceType: 'Content Marketing Software',
    offers: {
      description: 'AI-powered content strategy, competitor analysis, and automated content creation',
    },
  });

  return (
    <div className="min-h-screen">
      <StructuredData data={organizationSchema} />
      <StructuredData data={websiteSchema} />
      <StructuredData data={serviceSchema} />
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-50 via-white to-secondary-50 py-12 sm:py-20 lg:py-24 overflow-hidden">
        <Hero3DBackground className="opacity-30" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-5xl mx-auto">
            <AnimatedSection>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Turn Your Website Into a{' '}
                <span className="text-primary-600 bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent">
                  Powerful Engine
                </span>{' '}
                for Growth
              </h1>
            </AnimatedSection>
            <AnimatedSection delay={0.2}>
              <p className="text-lg sm:text-xl lg:text-2xl text-gray-700 mb-8 max-w-4xl mx-auto leading-relaxed">
                Level the playing field against your largest competitors with AI-powered content strategy. 
                Get strategically superior content that attracts the right audience and drives real results.
              </p>
            </AnimatedSection>
            <AnimatedSection delay={0.4} className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <AnimatedButton asChild size="lg" className="w-full sm:w-auto text-lg px-8 py-4" delay={0.5}>
                <Link href="/solutions/for-smbs">
                  Start Free Trial <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </AnimatedButton>
              <AnimatedButton asChild variant="outline" size="lg" className="w-full sm:w-auto text-lg px-8 py-4" delay={0.6}>
                <Link href="/resources">
                  See How It Works
                </Link>
              </AnimatedButton>
            </AnimatedSection>
            <AnimatedSection delay={0.7} className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Setup in under 10 minutes</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Australian business focused</span>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Your Secret Weapon Against Bigger Competitors
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
              While your competitors struggle with manual processes and guesswork, you'll have AI-powered intelligence 
              creating strategic content that drives real business results.
            </p>
          </AnimatedSection>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {features.map((feature, index) => (
              <AnimatedCard key={index} index={index} delay={0.2}>
                <CardHeader className="pb-4">
                  <div className="flex items-center space-x-4">
                    {feature.icon}
                    <CardTitle className="text-xl lg:text-2xl">{feature.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base lg:text-lg">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </AnimatedCard>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                Everything You Need to Dominate Your Market
              </h2>
              <p className="text-lg lg:text-xl text-gray-600 mb-8">
                Stop wasting time on content that doesn't work. Get a complete content strategy 
                system that turns your website into a customer acquisition machine.
              </p>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 text-lg">{benefit}</span>
                  </div>
                ))}
              </div>
              <div className="mt-8">
                <Button asChild size="lg" className="text-lg px-8">
                  <Link href="/solutions/for-smbs">
                    Get Started Today <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </div>
            <div className="space-y-6">
              <div className="bg-primary-600 text-white p-6 lg:p-8 rounded-xl">
                <div className="flex items-center space-x-4 mb-4">
                  <Target className="h-8 w-8" />
                  <h3 className="text-xl lg:text-2xl font-semibold">SMB Focused</h3>
                </div>
                <p className="text-primary-100">
                  Designed specifically for Australian small and medium businesses who need to compete 
                  with enterprise-level content strategies on a fraction of the budget.
                </p>
              </div>
              <div className="bg-white border-2 border-primary-200 p-6 lg:p-8 rounded-xl">
                <div className="flex items-center space-x-4 mb-4">
                  <Shield className="h-8 w-8 text-primary-600" />
                  <h3 className="text-xl lg:text-2xl font-semibold text-gray-900">Proven Process</h3>
                </div>
                <p className="text-gray-600">
                  Our 5-phase methodology has helped hundreds of Australian businesses transform 
                  their content marketing from an expense into a profit center.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Stats */}
      <SocialProofStats />

      {/* Testimonials Section */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Join Australian Businesses Already Winning
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
              See how Australian SMBs are using AI-powered content strategy to outrank and outperform 
              much larger competitors.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            {featuredTestimonials.map((testimonial, index) => (
              <Card key={index} className="p-6 lg:p-8">
                <CardContent className="space-y-6">
                  <blockquote className="text-lg lg:text-xl text-gray-700 leading-relaxed">
                    "{testimonial.quote}"
                  </blockquote>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-gray-900">{testimonial.author}</div>
                      <div className="text-gray-600">{testimonial.title}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary-600">{testimonial.results}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24 bg-primary-600">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Users className="h-16 w-16 text-white mx-auto mb-6" />
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
            Ready to Level the Playing Field?
          </h2>
          <p className="text-lg sm:text-xl lg:text-2xl text-primary-100 mb-8 max-w-4xl mx-auto">
            Stop letting bigger competitors dominate your market. Get the AI-powered content strategy 
            that turns your website into a customer acquisition machine.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button asChild size="lg" variant="secondary" className="w-full sm:w-auto text-lg px-8 py-4">
              <Link href="/solutions/for-smbs">
                Start Your Free Trial
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="w-full sm:w-auto text-lg px-8 py-4 border-white text-white hover:bg-white hover:text-primary-600">
              <Link href="/solutions/for-agencies">
                Agency Solutions
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}