'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import { Card } from '@/components/ui/Card';

interface AnimatedCardProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  index?: number;
}

export function AnimatedCard({ children, className = '', delay = 0, index = 0 }: AnimatedCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true }}
      whileHover={{ 
        y: -5,
        scale: 1.02,
        transition: { 
          duration: 0.2,
          ease: 'easeOut'
        }
      }}
      transition={{ 
        duration: 0.5, 
        delay: delay + (index * 0.1),
        ease: [0.21, 0.47, 0.32, 0.98]
      }}
      className={className}
    >
      <Card className="h-full transition-shadow duration-300 hover:shadow-xl">
        {children}
      </Card>
    </motion.div>
  );
}