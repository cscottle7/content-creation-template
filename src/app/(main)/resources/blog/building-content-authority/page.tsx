import { Metadata } from 'next';
import ArticleTemplate from '@/components/features/blog/ArticleTemplate';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { CheckCircle, Award, TrendingUp, Search, Users, Zap, Building, Target } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Building Content Authority for SMBs | The Bigger Boss',
  description: 'Establish thought leadership and topical authority in your industry niche. Learn proven strategies for Australian SMBs to become the go-to expert.',
  keywords: ['content authority', 'thought leadership', 'topical authority', 'SMB marketing', 'brand building'],
  openGraph: {
    title: 'Building Content Authority for SMBs',
    description: 'Establish thought leadership and topical authority in your industry niche.',
    type: 'article',
  },
};

const articleMetadata = {
  title: 'Building Content Authority for SMBs',
  description: 'Establish thought leadership and topical authority in your industry niche. Learn proven strategies for Australian SMBs to become the go-to expert in their field.',
  author: 'The Bigger Boss Team',
  publishDate: 'January 10, 2025',
  readTime: '10 min read',
  category: 'SEO',
  tags: ['Content Authority', 'Thought Leadership', 'SEO', 'Brand Building'],
};

const leadMagnetCTA = {
  title: 'Get Our Authority Building Checklist',
  description: 'Download our step-by-step checklist for building content authority, including topic research templates and content planning worksheets.',
  buttonText: 'Download Checklist',
  href: '/lead-magnets/smb-content-guide',
  type: 'checklist' as const,
};

const relatedArticles = [
  {
    title: 'The Complete Guide to Automated Content Strategy',
    description: 'Master AI-powered content strategy for maximum ROI and competitive advantage.',
    href: '/resources/blog/automated-content-strategy-guide',
    readTime: '15 min read',
    category: 'Strategy',
  },
  {
    title: 'Content ROI: Measuring Success in the AI Era',
    description: 'Learn how to track and optimize your content marketing returns with AI insights.',
    href: '/resources/blog/content-roi-measurement',
    readTime: '12 min read',
    category: 'Analytics',
  },
];

const tableOfContents = [
  { title: 'What is Content Authority?', id: 'what-is-content-authority', level: 1 },
  { title: 'Why Authority Matters for SMBs', id: 'why-authority-matters', level: 1 },
  { title: 'The Authority Building Framework', id: 'authority-framework', level: 1 },
  { title: 'Topic Research and Selection', id: 'topic-research', level: 1 },
  { title: 'Content Depth vs. Breadth Strategy', id: 'depth-vs-breadth', level: 1 },
  { title: 'Building Topical Clusters', id: 'topical-clusters', level: 1 },
  { title: 'Measuring Authority Progress', id: 'measuring-progress', level: 1 },
];

const authorityBenefits = [
  {
    icon: <Search className="h-8 w-8 text-blue-600" />,
    title: 'Higher Search Rankings',
    description: 'Google favors authoritative content, leading to better visibility for your target keywords.',
  },
  {
    icon: <Users className="h-8 w-8 text-green-600" />,
    title: 'Increased Trust',
    description: 'Customers choose businesses they perceive as industry experts and thought leaders.',
  },
  {
    icon: <TrendingUp className="h-8 w-8 text-purple-600" />,
    title: 'Premium Pricing',
    description: 'Authority allows you to charge higher prices than competitors with less expertise.',
  },
  {
    icon: <Building className="h-8 w-8 text-orange-600" />,
    title: 'Business Growth',
    description: 'Established authority leads to referrals, partnerships, and new business opportunities.',
  },
];

const authorityFramework = [
  {
    step: '1',
    title: 'Niche Definition',
    description: 'Identify your specific area of expertise and target audience',
    tasks: [
      'Define your unique value proposition',
      'Research competitor positioning',
      'Identify knowledge gaps in your market',
      'Choose your authority angle'
    ]
  },
  {
    step: '2',
    title: 'Topic Mapping',
    description: 'Create comprehensive coverage of your chosen subject area',
    tasks: [
      'Conduct keyword research for your niche',
      'Map customer journey touchpoints',
      'Identify frequently asked questions',
      'Plan content cluster architecture'
    ]
  },
  {
    step: '3',
    title: 'Content Creation',
    description: 'Develop high-quality, comprehensive content consistently',
    tasks: [
      'Create pillar pages for main topics',
      'Write supporting cluster content',
      'Include original research and insights',
      'Maintain consistent publishing schedule'
    ]
  },
  {
    step: '4',
    title: 'Authority Amplification',
    description: 'Promote your expertise beyond your own website',
    tasks: [
      'Guest posting on industry websites',
      'Speaking at industry events',
      'Participating in relevant online communities',
      'Building relationships with other experts'
    ]
  }
];

export default function BuildingContentAuthority() {
  return (
    <ArticleTemplate
      metadata={articleMetadata}
      leadMagnetCTA={leadMagnetCTA}
      relatedArticles={relatedArticles}
      showTableOfContents={true}
      tableOfContents={tableOfContents}
    >
      {/* Introduction */}
      <div className="mb-12">
        <p className="text-xl text-gray-700 leading-relaxed mb-6">
          In Australia's competitive business landscape, being good at what you do isn't enough—you need to be recognized as the expert. Content authority transforms small businesses from another option into the obvious choice for customers seeking solutions.
        </p>
        <p className="text-lg text-gray-600 leading-relaxed">
          This guide reveals how Australian SMBs can systematically build content authority to dominate their niche, attract premium customers, and establish lasting competitive advantages.
        </p>
      </div>

      {/* Authority Statistics */}
      <section className="mb-16">
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-8 rounded-lg">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">The Authority Advantage</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">3x</div>
              <p className="text-gray-700">higher click-through rates for authoritative content</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">67%</div>
              <p className="text-gray-700">of customers research company expertise before buying</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">45%</div>
              <p className="text-gray-700">premium pricing opportunity for authority leaders</p>
            </div>
          </div>
        </div>
      </section>

      {/* What is Content Authority */}
      <section id="what-is-content-authority" className="mb-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">What is Content Authority?</h2>
        <p className="text-lg text-gray-700 leading-relaxed mb-8">
          Content authority is your business's reputation as a trusted, knowledgeable source in your industry. It's built through consistently publishing high-quality, helpful content that demonstrates deep expertise and provides genuine value to your audience.
        </p>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <Card className="border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="text-green-800 flex items-center">
                <Award className="h-6 w-6 mr-2" />
                Signs of Strong Authority
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-green-700">
                <li>• Other businesses reference your content</li>
                <li>• Journalists quote you as an industry expert</li>
                <li>• Customers seek your opinion on industry trends</li>
                <li>• Competitors follow your content strategy</li>
                <li>• Your content ranks #1 for key industry terms</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="text-blue-800 flex items-center">
                <Target className="h-6 w-6 mr-2" />
                Google's Authority Signals
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-blue-700">
                <li>• High-quality backlinks from reputable sites</li>
                <li>• Consistent, long-form content on specific topics</li>
                <li>• Strong user engagement signals</li>
                <li>• Expert author credentials and bio</li>
                <li>• Regular content updates and freshness</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="bg-primary-50 border-l-4 border-primary-600 p-6 rounded-r-lg">
          <p className="text-primary-800 font-medium">
            <strong>Key Insight:</strong> Authority isn't built overnight. It requires consistent, high-quality content creation over 6-12 months, but the long-term benefits include sustainable competitive advantages and premium pricing power.
          </p>
        </div>
      </section>

      {/* Why Authority Matters */}
      <section id="why-authority-matters" className="mb-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Why Authority Matters for SMBs</h2>
        <p className="text-lg text-gray-700 leading-relaxed mb-8">
          For small and medium businesses, authority levels the playing field against larger competitors with bigger marketing budgets. Here's how authority transforms your business:
        </p>

        <div className="grid md:grid-cols-2 gap-8">
          {authorityBenefits.map((benefit, index) => (
            <Card key={index} className="p-6">
              <CardHeader className="pb-4">
                <div className="flex items-center space-x-4">
                  {benefit.icon}
                  <CardTitle className="text-xl">{benefit.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{benefit.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 bg-gray-50 p-8 rounded-lg">
          <h3 className="text-2xl font-semibold text-gray-900 mb-4">Real-World Authority Impact</h3>
          <div className="space-y-4">
            <div className="border-l-4 border-green-500 pl-4">
              <p className="text-gray-700"><strong>Melbourne Accounting Firm:</strong> Became the go-to tax expert for small businesses by publishing comprehensive tax guides. Result: 200% increase in consultation bookings.</p>
            </div>
            <div className="border-l-4 border-blue-500 pl-4">
              <p className="text-gray-700"><strong>Sydney Marketing Agency:</strong> Established authority in e-commerce marketing through detailed case studies. Result: 150% increase in average project value.</p>
            </div>
            <div className="border-l-4 border-purple-500 pl-4">
              <p className="text-gray-700"><strong>Brisbane Web Developer:</strong> Built reputation through technical tutorials and industry insights. Result: 6-month waiting list for new projects.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Authority Framework */}
      <section id="authority-framework" className="mb-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">The Authority Building Framework</h2>
        <p className="text-lg text-gray-700 leading-relaxed mb-8">
          Building content authority follows a systematic four-step process. Each step builds upon the previous, creating a comprehensive foundation for long-term expertise recognition:
        </p>

        <div className="space-y-8">
          {authorityFramework.map((phase, index) => (
            <Card key={index} className="p-8">
              <div className="flex items-start space-x-6">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-primary-600 text-white rounded-full flex items-center justify-center text-xl font-bold">
                    {phase.step}
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">{phase.title}</h3>
                  <p className="text-lg text-gray-700 leading-relaxed mb-6">{phase.description}</p>
                  <div className="grid md:grid-cols-2 gap-3">
                    {phase.tasks.map((task, taskIndex) => (
                      <div key={taskIndex} className="flex items-center space-x-2">
                        <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                        <span className="text-gray-700">{task}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Topic Research */}
      <section id="topic-research" className="mb-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Topic Research and Selection</h2>
        <p className="text-lg text-gray-700 leading-relaxed mb-8">
          Successful authority building starts with choosing the right topics to focus on. Here's how to identify your authority opportunity:
        </p>

        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">The Authority Sweet Spot</h3>
            <p className="text-gray-700 mb-6">
              Find topics where you have genuine expertise, there's significant audience demand, but limited high-quality content exists.
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center p-4 border border-gray-200 rounded-lg">
                <Award className="h-8 w-8 text-primary-600 mx-auto mb-3" />
                <h4 className="font-semibold text-gray-900 mb-2">Your Expertise</h4>
                <p className="text-sm text-gray-600">Areas where you have deep knowledge and experience</p>
              </div>
              <div className="text-center p-4 border border-gray-200 rounded-lg">
                <Users className="h-8 w-8 text-primary-600 mx-auto mb-3" />
                <h4 className="font-semibold text-gray-900 mb-2">Market Demand</h4>
                <p className="text-sm text-gray-600">Topics your audience actively searches for and discusses</p>
              </div>
              <div className="text-center p-4 border border-gray-200 rounded-lg">
                <Target className="h-8 w-8 text-primary-600 mx-auto mb-3" />
                <h4 className="font-semibold text-gray-900 mb-2">Content Gap</h4>
                <p className="text-sm text-gray-600">Limited comprehensive, high-quality content available</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Research Methods</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-700 mb-3">Keyword Analysis</h4>
                <ul className="space-y-2 text-gray-600">
                  <li>• Use tools like Google Keyword Planner or SEMrush</li>
                  <li>• Look for high-volume, low-competition keywords</li>
                  <li>• Focus on question-based searches</li>
                  <li>• Identify trending topics in your industry</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-700 mb-3">Competitor Gap Analysis</h4>
                <ul className="space-y-2 text-gray-600">
                  <li>• Analyze top 10 competitors' content</li>
                  <li>• Identify topics they haven't covered deeply</li>
                  <li>• Find opportunities to create better content</li>
                  <li>• Look for outdated information you can update</li>
                </ul>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Depth vs Breadth */}
      <section id="depth-vs-breadth" className="mb-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Content Depth vs. Breadth Strategy</h2>
        <p className="text-lg text-gray-700 leading-relaxed mb-8">
          One of the biggest mistakes SMBs make is trying to cover too many topics superficially. Authority requires choosing depth over breadth:
        </p>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <Card className="border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle className="text-red-800">Breadth Approach (Avoid)</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-red-700">
                <li>• Cover many topics with basic information</li>
                <li>• Compete with Wikipedia and major publications</li>
                <li>• Struggle to rank for competitive keywords</li>
                <li>• Appear as a generalist rather than expert</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="text-green-800">Depth Approach (Recommended)</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-green-700">
                <li>• Focus on 3-5 core topics extensively</li>
                <li>• Create comprehensive, definitive resources</li>
                <li>• Dominate niche keywords in your specialty</li>
                <li>• Establish clear expertise positioning</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="bg-blue-50 p-6 rounded-lg">
          <h3 className="text-xl font-semibold text-blue-800 mb-3">The 80/20 Authority Rule</h3>
          <p className="text-blue-700 leading-relaxed">
            Focus 80% of your content efforts on your core expertise areas and 20% on adjacent topics that support your main authority. This approach allows you to go deep enough to establish genuine expertise while maintaining some content variety.
          </p>
        </div>
      </section>

      {/* Topical Clusters */}
      <section id="topical-clusters" className="mb-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Building Topical Clusters</h2>
        <p className="text-lg text-gray-700 leading-relaxed mb-8">
          Topical clusters are groups of interlinked content pieces that comprehensively cover a subject. This structure helps both users and search engines understand your expertise:
        </p>

        <Card className="p-8 mb-8">
          <h3 className="text-2xl font-semibold text-gray-900 mb-6">Cluster Architecture Example</h3>
          <div className="text-center mb-6">
            <div className="inline-block bg-primary-600 text-white px-6 py-3 rounded-lg text-lg font-semibold">
              Pillar Page: "Digital Marketing for Restaurants"
            </div>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg text-center">
              <h4 className="font-semibold text-gray-900 mb-2">Social Media</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>Instagram strategies</li>
                <li>Facebook advertising</li>
                <li>User-generated content</li>
              </ul>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg text-center">
              <h4 className="font-semibold text-gray-900 mb-2">Local SEO</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>Google My Business</li>
                <li>Local citations</li>
                <li>Review management</li>
              </ul>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg text-center">
              <h4 className="font-semibold text-gray-900 mb-2">Email Marketing</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>List building</li>
                <li>Promotional campaigns</li>
                <li>Automation workflows</li>
              </ul>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg text-center">
              <h4 className="font-semibold text-gray-900 mb-2">Content Strategy</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>Food photography</li>
                <li>Menu promotion</li>
                <li>Event marketing</li>
              </ul>
            </div>
          </div>
        </Card>

        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Best Practices for Cluster Building</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0 mt-0.5" />
                <div>
                  <strong>Start with pillar pages:</strong> Create comprehensive 3,000+ word guides covering main topics
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0 mt-0.5" />
                <div>
                  <strong>Build cluster content:</strong> Write 1,000-2,000 word articles on specific subtopics
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0 mt-0.5" />
                <div>
                  <strong>Link strategically:</strong> Connect cluster content to pillar pages and related articles
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0 mt-0.5" />
                <div>
                  <strong>Update regularly:</strong> Keep content fresh with new information and insights
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Measuring Progress */}
      <section id="measuring-progress" className="mb-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Measuring Authority Progress</h2>
        <p className="text-lg text-gray-700 leading-relaxed mb-8">
          Authority building is a long-term strategy that requires consistent monitoring. Track these key metrics to measure your progress:
        </p>

        <div className="grid md:grid-cols-2 gap-8">
          <Card className="p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Search Performance Metrics</h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-3">
                <TrendingUp className="h-5 w-5 text-primary-600" />
                <span>Keyword ranking improvements for target terms</span>
              </li>
              <li className="flex items-center space-x-3">
                <Search className="h-5 w-5 text-primary-600" />
                <span>Organic traffic growth to authority content</span>
              </li>
              <li className="flex items-center space-x-3">
                <Award className="h-5 w-5 text-primary-600" />
                <span>Featured snippet captures for your content</span>
              </li>
              <li className="flex items-center space-x-3">
                <Target className="h-5 w-5 text-primary-600" />
                <span>Click-through rate improvements</span>
              </li>
            </ul>
          </Card>

          <Card className="p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Authority Signals</h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-3">
                <Building className="h-5 w-5 text-primary-600" />
                <span>Backlinks from industry publications</span>
              </li>
              <li className="flex items-center space-x-3">
                <Users className="h-5 w-5 text-primary-600" />
                <span>Social media mentions and shares</span>
              </li>
              <li className="flex items-center space-x-3">
                <Zap className="h-5 w-5 text-primary-600" />
                <span>Speaking invitations and media requests</span>
              </li>
              <li className="flex items-center space-x-3">
                <Award className="h-5 w-5 text-primary-600" />
                <span>Industry awards and recognition</span>
              </li>
            </ul>
          </Card>
        </div>

        <div className="mt-8 bg-yellow-50 border-l-4 border-yellow-500 p-6 rounded-r-lg">
          <h3 className="text-lg font-semibold text-yellow-800 mb-2">Timeline Expectations</h3>
          <p className="text-yellow-700">
            Authority building typically takes 6-12 months to show significant results. Focus on consistent content creation and quality rather than quick wins. Most successful authority-building campaigns see major improvements in months 8-18.
          </p>
        </div>
      </section>

      {/* Conclusion */}
      <section className="mb-16">
        <div className="bg-primary-600 text-white p-8 rounded-lg">
          <h2 className="text-3xl font-bold mb-6">Start Building Your Authority Today</h2>
          <p className="text-xl text-primary-100 leading-relaxed mb-8">
            Content authority isn't just about being known—it's about being known as the expert. In Australia's competitive market, businesses with established authority command premium pricing, attract better customers, and build sustainable competitive advantages.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button asChild size="lg" variant="secondary" className="text-lg px-8">
              <Link href="/solutions/for-smbs">
                Get Started - SMBs
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="text-lg px-8 border-white text-white hover:bg-white hover:text-primary-600">
              <Link href="/resources/blog/automated-content-strategy-guide">
                Read Strategy Guide
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </ArticleTemplate>
  );
}