'use client';

import { motion } from 'framer-motion';
import { Button, ButtonProps } from '@/components/ui/Button';
import { ReactNode } from 'react';

interface AnimatedButtonProps extends ButtonProps {
  children: ReactNode;
  delay?: number;
}

export function AnimatedButton({ children, delay = 0, ...props }: AnimatedButtonProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.5, 
        delay,
        ease: [0.21, 0.47, 0.32, 0.98]
      }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.98 }}
    >
      <Button {...props}>
        {children}
      </Button>
    </motion.div>
  );
}