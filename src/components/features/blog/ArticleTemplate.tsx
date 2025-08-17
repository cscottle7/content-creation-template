'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Calendar, Clock, User, ArrowRight, BookOpen, Download } from 'lucide-react';

interface ArticleMetadata {
  title: string;
  description: string;
  author: string;
  publishDate: string;
  readTime: string;
  category: string;
  tags: string[];
}

interface LeadMagnetCTA {
  title: string;
  description: string;
  buttonText: string;
  href: string;
  type: 'pdf' | 'webinar' | 'checklist';
}

interface RelatedArticle {
  title: string;
  description: string;
  href: string;
  readTime: string;
  category: string;
}

interface ArticleTemplateProps {
  metadata: ArticleMetadata;
  children: ReactNode;
  leadMagnetCTA?: LeadMagnetCTA;
  relatedArticles?: RelatedArticle[];
  showTableOfContents?: boolean;
  tableOfContents?: Array<{ title: string; id: string; level: number }>;
}

export default function ArticleTemplate({
  metadata,
  children,
  leadMagnetCTA,
  relatedArticles = [],
  showTableOfContents = false,
  tableOfContents = [],
}: ArticleTemplateProps) {
  const getLeadMagnetIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return <Download className="h-5 w-5" />;
      case 'webinar':
        return <BookOpen className="h-5 w-5" />;
      case 'checklist':
        return <BookOpen className="h-5 w-5" />;
      default:
        return <Download className="h-5 w-5" />;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Article Header */}
      <header className="bg-gradient-to-br from-primary-50 via-white to-secondary-50 py-12">
        <div className="max-w-4xl mx-auto px-6">
          <div className="mb-6">
            <Link 
              href="/resources" 
              className="inline-flex items-center text-primary-600 hover:text-primary-700 transition-colors"
            >
              ← Back to Resources
            </Link>
          </div>
          
          <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-3">
              <Badge variant="secondary" className="bg-primary-100 text-primary-700">
                {metadata.category}
              </Badge>
              {metadata.tags.map((tag) => (
                <Badge key={tag} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>
            
            <h1 className="text-3xl md:text-5xl font-bold text-gray-900 leading-tight">
              {metadata.title}
            </h1>
            
            <p className="text-xl text-gray-700 leading-relaxed">
              {metadata.description}
            </p>
            
            <div className="flex flex-wrap items-center gap-6 text-gray-600">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>{metadata.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{metadata.publishDate}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>{metadata.readTime}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-4 gap-12">
          {/* Table of Contents - Optional */}
          {showTableOfContents && tableOfContents.length > 0 && (
            <div className="lg:col-span-1">
              <div className="sticky top-6">
                <Card className="p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Table of Contents</h3>
                  <nav className="space-y-2">
                    {tableOfContents.map((item) => (
                      <a
                        key={item.id}
                        href={`#${item.id}`}
                        className={`block text-sm hover:text-primary-600 transition-colors ${
                          item.level === 2 ? 'pl-4' : ''
                        } ${
                          item.level === 3 ? 'pl-8' : ''
                        }`}
                      >
                        {item.title}
                      </a>
                    ))}
                  </nav>
                </Card>
              </div>
            </div>
          )}

          {/* Main Content */}
          <div className={`${showTableOfContents ? 'lg:col-span-3' : 'lg:col-span-4'}`}>
            <div className="max-w-3xl">
              {/* Article Content */}
              <article className="prose prose-lg prose-primary max-w-none">
                {children}
              </article>

              {/* Lead Magnet CTA - Embedded in Article */}
              {leadMagnetCTA && (
                <div className="my-12">
                  <Card className="border-2 border-primary-200 bg-gradient-to-r from-primary-50 to-secondary-50">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        {getLeadMagnetIcon(leadMagnetCTA.type)}
                        <CardTitle className="text-xl text-primary-700">
                          {leadMagnetCTA.title}
                        </CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-base mb-6">
                        {leadMagnetCTA.description}
                      </CardDescription>
                      <Button asChild size="lg" className="w-full sm:w-auto">
                        <Link href={leadMagnetCTA.href}>
                          {leadMagnetCTA.buttonText} <ArrowRight className="ml-2 h-5 w-5" />
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Related Articles */}
              {relatedArticles.length > 0 && (
                <section className="mt-16 pt-12 border-t border-gray-200">
                  <h3 className="text-2xl font-bold text-gray-900 mb-8">Related Articles</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    {relatedArticles.map((article) => (
                      <Card key={article.href} className="group hover:shadow-lg transition-all duration-300">
                        <CardHeader>
                          <div className="flex items-center justify-between mb-2">
                            <Badge variant="outline">{article.category}</Badge>
                            <span className="text-sm text-gray-500">{article.readTime}</span>
                          </div>
                          <CardTitle className="text-lg group-hover:text-primary-600 transition-colors">
                            {article.title}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <CardDescription className="mb-4">
                            {article.description}
                          </CardDescription>
                          <Button asChild variant="outline" size="sm" className="group-hover:bg-primary-600 group-hover:text-white transition-colors">
                            <Link href={article.href}>
                              Read More <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </section>
              )}

              {/* Newsletter CTA */}
              <section className="mt-16 pt-12 border-t border-gray-200">
                <Card className="bg-primary-600 text-white">
                  <CardHeader>
                    <CardTitle className="text-2xl">Stay Updated</CardTitle>
                    <CardDescription className="text-primary-100">
                      Get the latest insights on AI-powered content strategy delivered to your inbox.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col sm:flex-row gap-4">
                      <Button asChild variant="secondary" size="lg">
                        <Link href="/lead-magnets/smb-content-guide">
                          Get Free Content Guide
                        </Link>
                      </Button>
                      <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-primary-600">
                        <Link href="/resources">
                          Browse All Resources
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}