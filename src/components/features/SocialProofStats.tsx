'use client';

import { AnimatedSection } from './AnimatedSection';
import { AnimatedCounter } from './AnimatedCounter';
import { socialProofStats } from '@/lib/testimonials';

interface SocialProofStatsProps {
  className?: string;
  variant?: 'default' | 'dark';
}

export function SocialProofStats({ className = '', variant = 'default' }: SocialProofStatsProps) {
  const isDark = variant === 'dark';
  
  return (
    <section className={`py-16 ${isDark ? 'bg-gray-900' : 'bg-gray-50'} ${className}`}>
      <div className="container mx-auto px-6">
        <AnimatedSection>
          <div className="text-center mb-12">
            <h2 className={`text-3xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Trusted by Australian Businesses
            </h2>
            <p className={`text-xl ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              Real results from real businesses across Australia
            </p>
          </div>
        </AnimatedSection>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {socialProofStats.map((stat, index) => (
            <AnimatedSection key={index} delay={index * 0.1} className="text-center">
              <div className="mb-4 text-4xl">{stat.icon}</div>
              <AnimatedCounter
                value={parseFloat(stat.number.replace(/[^0-9.]/g, ''))}
                suffix={stat.number.replace(/[0-9.]/g, '')}
                className={`text-3xl md:text-4xl font-bold mb-2 ${isDark ? 'text-white' : 'text-primary-600'}`}
                delay={index * 0.1 + 0.5}
              />
              <p className={`text-sm md:text-base ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                {stat.description}
              </p>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}