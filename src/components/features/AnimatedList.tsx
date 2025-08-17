'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface AnimatedListProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export function AnimatedList({ children, className = '', delay = 0 }: AnimatedListProps) {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        delayChildren: delay,
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, x: -20 },
    show: { 
      opacity: 1, 
      x: 0,
      transition: {
        duration: 0.5,
        ease: [0.21, 0.47, 0.32, 0.98] as [number, number, number, number]
      }
    },
  };

  return (
    <motion.ul
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      className={className}
    >
      {Array.isArray(children) ? 
        children.map((child, index) => (
          <motion.li key={index} variants={item}>
            {child}
          </motion.li>
        )) :
        <motion.li variants={item}>
          {children}
        </motion.li>
      }
    </motion.ul>
  );
}