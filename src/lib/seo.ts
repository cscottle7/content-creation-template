import { Metadata } from 'next';

export interface SEOConfig {
  title: string;
  description: string;
  keywords?: string[];
  openGraph?: {
    title?: string;
    description?: string;
    type?: 'website' | 'article';
    images?: Array<{
      url: string;
      width?: number;
      height?: number;
      alt?: string;
    }>;
  };
  twitter?: {
    card?: 'summary' | 'summary_large_image';
    title?: string;
    description?: string;
    images?: string[];
  };
  canonical?: string;
  robots?: string;
}

const defaultConfig = {
  siteName: 'The Bigger Boss',
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://thebiggerboss.com',
  defaultImage: '/images/og-default.jpg',
  twitterHandle: '@thebiggerboss',
};

export function generateMetadata(config: SEOConfig): Metadata {
  const {
    title,
    description,
    keywords = [],
    openGraph = {},
    twitter = {},
    canonical,
    robots = 'index, follow',
  } = config;

  const fullTitle = title.includes(defaultConfig.siteName) 
    ? title 
    : title;

  const ogTitle = openGraph.title || title;
  const ogDescription = openGraph.description || description;
  const ogImage = openGraph.images?.[0]?.url || defaultConfig.defaultImage;

  return {
    title: fullTitle,
    description,
    keywords: keywords.length > 0 ? keywords.join(', ') : undefined,
    robots,
    alternates: {
      canonical: canonical || undefined,
    },
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      type: openGraph.type || 'website',
      siteName: defaultConfig.siteName,
      url: canonical || defaultConfig.siteUrl,
      images: [
        {
          url: ogImage,
          width: openGraph.images?.[0]?.width || 1200,
          height: openGraph.images?.[0]?.height || 630,
          alt: openGraph.images?.[0]?.alt || title,
        },
      ],
    },
    twitter: {
      card: twitter.card || 'summary_large_image',
      title: twitter.title || ogTitle,
      description: twitter.description || ogDescription,
      images: twitter.images || [ogImage],
      creator: defaultConfig.twitterHandle,
    },
  };
}

// Structured Data Schemas
export interface OrganizationSchema {
  '@context': 'https://schema.org';
  '@type': 'Organization';
  name: string;
  url: string;
  logo: string;
  description: string;
  address?: {
    '@type': 'PostalAddress';
    addressCountry: string;
    addressRegion?: string;
  };
  contactPoint?: Array<{
    '@type': 'ContactPoint';
    telephone?: string;
    contactType: string;
    email?: string;
  }>;
  sameAs?: string[];
}

export interface WebsiteSchema {
  '@context': 'https://schema.org';
  '@type': 'WebSite';
  name: string;
  url: string;
  description: string;
  potentialAction?: {
    '@type': 'SearchAction';
    target: string;
    'query-input': string;
  };
}

export interface ArticleSchema {
  '@context': 'https://schema.org';
  '@type': 'Article';
  headline: string;
  description: string;
  author: {
    '@type': 'Organization';
    name: string;
  };
  publisher: {
    '@type': 'Organization';
    name: string;
    logo: {
      '@type': 'ImageObject';
      url: string;
    };
  };
  datePublished: string;
  dateModified: string;
  mainEntityOfPage: string;
  image?: string[];
}

export interface ServiceSchema {
  '@context': 'https://schema.org';
  '@type': 'Service';
  name: string;
  description: string;
  provider: {
    '@type': 'Organization';
    name: string;
  };
  areaServed: {
    '@type': 'Country';
    name: string;
  };
  serviceType: string;
  offers?: {
    '@type': 'Offer';
    description: string;
    priceCurrency?: string;
    price?: string;
  };
}

export function generateOrganizationSchema(): OrganizationSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'The Bigger Boss',
    url: defaultConfig.siteUrl,
    logo: `${defaultConfig.siteUrl}/images/logo.png`,
    description: 'AI-powered content strategy platform for Australian SMBs and marketing agencies',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'AU',
    },
    contactPoint: [
      {
        '@type': 'ContactPoint',
        contactType: 'customer service',
        email: 'hello@thebiggerboss.com',
      },
    ],
    sameAs: [
      'https://twitter.com/thebiggerboss',
      'https://linkedin.com/company/thebiggerboss',
    ],
  };
}

export function generateWebsiteSchema(): WebsiteSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'The Bigger Boss',
    url: defaultConfig.siteUrl,
    description: 'AI-powered content strategy platform for Australian SMBs and marketing agencies',
    potentialAction: {
      '@type': 'SearchAction',
      target: `${defaultConfig.siteUrl}/search?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };
}

export function generateArticleSchema({
  headline,
  description,
  datePublished,
  dateModified,
  url,
  images = [],
}: {
  headline: string;
  description: string;
  datePublished: string;
  dateModified?: string;
  url: string;
  images?: string[];
}): ArticleSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline,
    description,
    author: {
      '@type': 'Organization',
      name: 'The Bigger Boss',
    },
    publisher: {
      '@type': 'Organization',
      name: 'The Bigger Boss',
      logo: {
        '@type': 'ImageObject',
        url: `${defaultConfig.siteUrl}/images/logo.png`,
      },
    },
    datePublished,
    dateModified: dateModified || datePublished,
    mainEntityOfPage: url,
    image: images.length > 0 ? images : undefined,
  };
}

export function generateServiceSchema({
  name,
  description,
  serviceType,
  offers,
}: {
  name: string;
  description: string;
  serviceType: string;
  offers?: {
    description: string;
    priceCurrency?: string;
    price?: string;
  };
}): ServiceSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name,
    description,
    provider: {
      '@type': 'Organization',
      name: 'The Bigger Boss',
    },
    areaServed: {
      '@type': 'Country',
      name: 'Australia',
    },
    serviceType,
    offers: offers ? {
      '@type': 'Offer',
      description: offers.description,
      priceCurrency: offers.priceCurrency,
      price: offers.price,
    } : undefined,
  };
}

// FAQ Schema for SEO
export interface FAQSchema {
  '@context': 'https://schema.org';
  '@type': 'FAQPage';
  mainEntity: Array<{
    '@type': 'Question';
    name: string;
    acceptedAnswer: {
      '@type': 'Answer';
      text: string;
    };
  }>;
}

export function generateFAQSchema(faqs: Array<{ question: string; answer: string }>): FAQSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

// Breadcrumb Schema
export interface BreadcrumbSchema {
  '@context': 'https://schema.org';
  '@type': 'BreadcrumbList';
  itemListElement: Array<{
    '@type': 'ListItem';
    position: number;
    name: string;
    item: string;
  }>;
}

export function generateBreadcrumbSchema(items: Array<{ name: string; url: string }>): BreadcrumbSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

// Software Application Schema for SaaS
export interface SoftwareApplicationSchema {
  '@context': 'https://schema.org';
  '@type': 'SoftwareApplication';
  name: string;
  description: string;
  applicationCategory: string;
  operatingSystem: string;
  offers: {
    '@type': 'Offer';
    price: string;
    priceCurrency: string;
    name: string;
  };
  aggregateRating?: {
    '@type': 'AggregateRating';
    ratingValue: string;
    ratingCount: string;
    bestRating: string;
  };
}

export function generateSoftwareApplicationSchema(): SoftwareApplicationSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'The Bigger Boss',
    description: 'AI Content Strategist that builds complete, data-driven content plans for business growth',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web Browser',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'AUD',
      name: 'Free Trial',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '127',
      bestRating: '5',
    },
  };
}

// Page-specific SEO configurations
export const pageSEOConfigs = {
  home: {
    title: 'The Bigger Boss - AI Content Strategist for Australian Businesses',
    description: 'Stop guessing, start strategizing. The AI Content Strategist that builds complete, data-driven content plans to grow your Australian business. Free trial available.',
    keywords: ['AI content strategist', 'content marketing automation', 'business growth Australia', 'automated content strategy', 'AI marketing strategist'],
    canonical: `${defaultConfig.siteUrl}/`,
  },
  
  smbSolutions: {
    title: 'AI Content Strategy for SMBs - Compete with Big Players',
    description: 'Finally compete with larger competitors. Get strategically superior content that turns your website into a powerful engine for growth. 14-day free trial.',
    keywords: ['small business content marketing', 'SMB marketing automation', 'compete with big businesses', 'content strategy small business'],
    canonical: `${defaultConfig.siteUrl}/solutions/for-smbs`,
  },
  
  agencySolutions: {
    title: 'AI Content Strategy for Agencies - Scale Your Operations',
    description: 'Scale your agency with AI-powered content strategy. Deliver premium results faster while focusing your team on high-value client relationships.',
    keywords: ['marketing agency automation', 'agency content tools', 'scale marketing agency', 'client retention tools'],
    canonical: `${defaultConfig.siteUrl}/solutions/for-agencies`,
  },
  
  pricing: {
    title: 'Pricing - Strategic Content Plans That Grow Your Business',
    description: 'Transparent pricing for AI-powered content strategy. Plans start with free trial. No word counts, just results-driven strategic blueprints.',
    keywords: ['content strategy pricing', 'AI marketing tool pricing', 'content automation cost'],
    canonical: `${defaultConfig.siteUrl}/pricing`,
  },
  
  about: {
    title: 'About The Bigger Boss - AI Content Strategy Revolution',
    description: 'Learn how The Bigger Boss is revolutionizing content strategy with AI. Meet the team bringing strategic thinking to automated content creation.',
    keywords: ['about the bigger boss', 'AI content strategy company', 'content marketing innovation'],
    canonical: `${defaultConfig.siteUrl}/about`,
  },
  
  contact: {
    title: 'Contact Us - Get Support for Your Content Strategy',
    description: 'Get in touch with The Bigger Boss team. Sales inquiries, support questions, and partnership opportunities welcome.',
    keywords: ['contact the bigger boss', 'content strategy support', 'sales inquiry'],
    canonical: `${defaultConfig.siteUrl}/contact`,
  },
};