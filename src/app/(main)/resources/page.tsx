import { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ArrowRight, BookOpen, TrendingUp, Users, Zap } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Resources - AI Content Strategy Insights | The Bigger Boss',
  description: 'Access expert insights on AI-powered content strategy, SEO optimization, and automated content creation for Australian SMBs and marketing agencies.',
  keywords: ['AI content strategy', 'SEO optimization', 'content automation', 'digital marketing', 'Australian SMB'],
  openGraph: {
    title: 'Resources - AI Content Strategy Insights | The Bigger Boss',
    description: 'Access expert insights on AI-powered content strategy, SEO optimization, and automated content creation.',
    type: 'website',
  },
};

const featuredArticles = [
  {
    title: 'The Complete Guide to Automated Content Strategy',
    description: 'Master the fundamentals of AI-powered content creation and strategic planning.',
    category: 'Strategy',
    readTime: '15 min read',
    href: '/resources/blog/automated-content-strategy-guide',
    icon: <Zap className="h-6 w-6" />,
    featured: true,
  },
  {
    title: 'Content ROI: Measuring Success in the AI Era',
    description: 'Learn how to track and optimize your content marketing returns with AI insights.',
    category: 'Analytics',
    readTime: '12 min read',
    href: '/resources/blog/content-roi-measurement',
    icon: <TrendingUp className="h-6 w-6" />,
  },
  {
    title: 'Building Content Authority for SMBs',
    description: 'Establish thought leadership and topical authority in your industry niche.',
    category: 'SEO',
    readTime: '10 min read',
    href: '/resources/blog/building-content-authority',
    icon: <BookOpen className="h-6 w-6" />,
  },
];

const resourceCategories = [
  {
    title: 'Strategy Guides',
    description: 'Comprehensive guides on content strategy and planning',
    count: '8 articles',
    href: '/resources/blog?category=strategy',
  },
  {
    title: 'SEO & Optimization',
    description: 'Technical SEO and content optimization insights',
    count: '12 articles',
    href: '/resources/blog?category=seo',
  },
  {
    title: 'AI & Automation',
    description: 'Latest trends in AI-powered content creation',
    count: '6 articles',
    href: '/resources/blog?category=ai',
  },
  {
    title: 'Case Studies',
    description: 'Real-world success stories and outcomes',
    count: '4 studies',
    href: '/resources/blog?category=case-studies',
  },
];

export default function ResourcesPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 via-white to-secondary-50 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Content Strategy
              <span className="block text-primary-600">Resource Hub</span>
            </h1>
            <p className="text-xl text-gray-700 mb-8 leading-relaxed">
              Access expert insights, practical guides, and proven strategies to master 
              AI-powered content creation for your business.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="text-lg px-8">
                <Link href="#featured-content">
                  Explore Resources <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-lg px-8">
                <Link href="/lead-magnets/smb-content-guide">
                  Get Free Content Guide
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Content */}
      <section id="featured-content" className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Featured Resources
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our most popular content to help you build a powerful, AI-driven content strategy.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {featuredArticles.map((article, index) => (
              <Card 
                key={article.href} 
                className={`group hover:shadow-xl transition-all duration-300 ${
                  article.featured ? 'lg:col-span-2 lg:row-span-2' : ''
                }`}
              >
                <CardHeader className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-primary-600">
                      {article.icon}
                      <span className="text-sm font-medium">{article.category}</span>
                    </div>
                    <span className="text-sm text-gray-500">{article.readTime}</span>
                  </div>
                  <CardTitle className="text-xl group-hover:text-primary-600 transition-colors">
                    {article.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base mb-6">
                    {article.description}
                  </CardDescription>
                  <Button asChild variant="outline" className="group-hover:bg-primary-600 group-hover:text-white transition-colors">
                    <Link href={article.href}>
                      Read Article <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Resource Categories */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Browse by Category
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Find exactly what you need with our organized content library.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {resourceCategories.map((category) => (
              <Card key={category.href} className="group hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-lg group-hover:text-primary-600 transition-colors">
                    {category.title}
                  </CardTitle>
                  <CardDescription>{category.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">{category.count}</span>
                    <Button asChild variant="ghost" size="sm" className="group-hover:text-primary-600">
                      <Link href={category.href}>
                        View All <ArrowRight className="ml-1 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-primary-600">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <Users className="h-16 w-16 text-white mx-auto mb-6" />
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Transform Your Content Strategy?
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Join thousands of Australian businesses using AI to create content that converts.
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
        </div>
      </section>
    </div>
  );
}