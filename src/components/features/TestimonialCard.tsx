'use client';

import { Card, CardContent } from '@/components/ui/Card';
import { Star, Quote } from 'lucide-react';
import Image from 'next/image';

interface TestimonialProps {
  quote: string;
  author: string;
  title: string;
  company: string;
  location: string;
  results: string;
  persona: 'smb' | 'agency';
  avatar?: string;
  rating?: number;
}

export function TestimonialCard({ 
  quote, 
  author, 
  title, 
  company, 
  location, 
  results, 
  persona,
  avatar,
  rating = 5 
}: TestimonialProps) {
  const personaColors = {
    smb: 'from-green-400 to-blue-500',
    agency: 'from-purple-400 to-indigo-600'
  };

  return (
    <Card className="h-full">
      <CardContent className="p-6">
        <div className="flex items-center mb-4">
          <div className="flex text-yellow-400">
            {[...Array(rating)].map((_, i) => (
              <Star key={i} className="h-4 w-4 fill-current" />
            ))}
          </div>
        </div>

        <div className="relative mb-6">
          <Quote className="h-8 w-8 text-gray-300 absolute -top-2 -left-2" />
          <blockquote className="text-lg text-gray-700 leading-relaxed italic pl-6">
            "{quote}"
          </blockquote>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {avatar ? (
              <Image
                src={avatar}
                alt={author}
                width={48}
                height={48}
                className="rounded-full"
              />
            ) : (
              <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${personaColors[persona]} flex items-center justify-center text-white font-semibold`}>
                {author.split(' ').map(n => n[0]).join('')}
              </div>
            )}
            <div>
              <div className="font-semibold text-gray-900">{author}</div>
              <div className="text-sm text-gray-600">{title}</div>
              <div className="text-sm text-gray-500">{company} • {location}</div>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary-600">{results}</div>
            <div className="text-sm text-gray-500">Key Result</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface TestimonialsSectionProps {
  testimonials: TestimonialProps[];
  title?: string;
  description?: string;
  className?: string;
}

export function TestimonialsSection({ 
  testimonials, 
  title = "What Our Clients Say",
  description = "Real results from real Australian businesses",
  className = ""
}: TestimonialsSectionProps) {
  return (
    <section className={`py-16 ${className}`}>
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {title}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {description}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={index} {...testimonial} />
          ))}
        </div>
      </div>
    </section>
  );
}