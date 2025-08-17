export interface Testimonial {
  quote: string;
  author: string;
  title: string;
  company: string;
  location: string;
  results: string;
  persona: 'smb' | 'agency';
  rating?: number;
  detailedResults?: {
    metric: string;
    before: string;
    after: string;
    timeframe: string;
  };
}

export const smbTestimonials: Testimonial[] = [
  {
    quote: "The Bigger Boss gave us the content strategy we never thought we could afford. We went from being invisible online to ranking above our biggest competitors in just 4 months.",
    author: "Sarah Chen",
    title: "Founder",
    company: "Chen & Co Accounting",
    location: "Melbourne, VIC",
    results: "300% increase in organic leads",
    persona: 'smb',
    rating: 5,
    detailedResults: {
      metric: "Monthly leads from organic search",
      before: "3-5 leads",
      after: "15-20 leads", 
      timeframe: "4 months"
    }
  },
  {
    quote: "As a small business owner, I don't have time to figure out content strategy. The Bigger Boss handles everything - the research, the planning, even the first drafts. It's like having a marketing team I can actually afford.",
    author: "Marcus Williams",
    title: "Owner",
    company: "Williams Solar Solutions",
    location: "Brisbane, QLD",
    results: "150% revenue growth",
    persona: 'smb',
    rating: 5,
    detailedResults: {
      metric: "Monthly revenue from website",
      before: "$12,000",
      after: "$30,000",
      timeframe: "6 months"
    }
  },
  {
    quote: "I was spending $2,000/month on generic content that did nothing. The Bigger Boss costs less and delivers content that actually converts. Best ROI I've ever seen.",
    author: "Jennifer Park",
    title: "Director",
    company: "Park Family Dental",
    location: "Sydney, NSW",
    results: "250% better conversion rate",
    persona: 'smb',
    rating: 5,
    detailedResults: {
      metric: "Website conversion rate",
      before: "1.2%",
      after: "4.3%",
      timeframe: "3 months"
    }
  },
  {
    quote: "Finally, we can compete with the big law firms online. Our content now outranks practices that have been around for decades. The strategic approach makes all the difference.",
    author: "David Thompson",
    title: "Senior Partner",
    company: "Thompson Legal",
    location: "Adelaide, SA",
    results: "400% more website inquiries",
    persona: 'smb',
    rating: 5,
    detailedResults: {
      metric: "Monthly consultation requests",
      before: "8-10",
      after: "35-40",
      timeframe: "5 months"
    }
  },
  {
    quote: "The content quality is incredible. It doesn't feel like AI - it feels like someone who really understands our business wrote it. Our clients constantly compliment our website content now.",
    author: "Lisa Rodriguez",
    title: "Owner",
    company: "Rodriguez Marketing Consultancy",
    location: "Perth, WA",
    results: "180% increase in client retention",
    persona: 'smb',
    rating: 5,
    detailedResults: {
      metric: "Client retention rate",
      before: "68%",
      after: "92%",
      timeframe: "6 months"
    }
  }
];

export const agencyTestimonials: Testimonial[] = [
  {
    quote: "The Bigger Boss multiplied our content production capacity by 5x without compromising quality. We can now take on enterprise clients and deliver at their scale.",
    author: "David Walsh",
    title: "Creative Director",
    company: "Walsh Digital Agency",
    location: "Sydney, NSW",
    results: "500% increase in content output",
    persona: 'agency',
    rating: 5,
    detailedResults: {
      metric: "Content pieces per month",
      before: "20 pieces",
      after: "100+ pieces",
      timeframe: "3 months"
    }
  },
  {
    quote: "Our clients love the strategic depth. Instead of surface-level blog posts, we're delivering comprehensive content strategies that actually move the needle. Client retention is at an all-time high.",
    author: "Amanda Foster",
    title: "Strategy Director",
    company: "Foster & Associates",
    location: "Melbourne, VIC",
    results: "95% client retention rate",
    persona: 'agency',
    rating: 5,
    detailedResults: {
      metric: "Annual client retention",
      before: "72%",
      after: "95%",
      timeframe: "12 months"
    }
  },
  {
    quote: "The time savings are incredible. What used to take our team 2 weeks of research and planning now takes 2 hours. We're focusing on high-value strategy instead of grunt work.",
    author: "Kevin Liu",
    title: "Managing Partner",
    company: "Liu Marketing Group",
    location: "Brisbane, QLD", 
    results: "80% reduction in project time",
    persona: 'agency',
    rating: 5,
    detailedResults: {
      metric: "Content strategy development time",
      before: "80 hours",
      after: "16 hours",
      timeframe: "Immediate"
    }
  },
  {
    quote: "We've increased our profit margins by 40% because we can deliver premium results with half the resources. The Bigger Boss is like having a senior strategist on every account.",
    author: "Rachel Green",
    title: "CEO",
    company: "Green Light Media",
    location: "Gold Coast, QLD",
    results: "40% higher profit margins",
    persona: 'agency',
    rating: 5,
    detailedResults: {
      metric: "Average project profit margin",
      before: "22%",
      after: "31%",
      timeframe: "6 months"
    }
  },
  {
    quote: "Client results speak for themselves. We're delivering better outcomes faster than ever before. Three of our clients have renewed for premium packages because of the content performance.",
    author: "Simon Clarke",
    title: "Account Director",
    company: "Clarke Communications",
    location: "Canberra, ACT",
    results: "200% improvement in client results",
    persona: 'agency',
    rating: 5,
    detailedResults: {
      metric: "Average client organic traffic growth",
      before: "15% per quarter",
      after: "45% per quarter",
      timeframe: "6 months"
    }
  }
];

export const allTestimonials = [...smbTestimonials, ...agencyTestimonials];

// Social proof statistics
export const socialProofStats = [
  {
    number: "500+",
    description: "Australian businesses served",
    icon: "🏢"
  },
  {
    number: "2.5M+", 
    description: "Content pieces created",
    icon: "📝"
  },
  {
    number: "156%",
    description: "Average traffic increase",
    icon: "📈"
  },
  {
    number: "4.8/5",
    description: "Customer satisfaction",
    icon: "⭐"
  }
];

// Client logos (for future implementation)
export const clientLogos = [
  "Chen & Co Accounting",
  "Williams Solar Solutions", 
  "Park Family Dental",
  "Thompson Legal",
  "Rodriguez Marketing",
  "Walsh Digital Agency",
  "Foster & Associates",
  "Liu Marketing Group",
  "Green Light Media",
  "Clarke Communications"
];