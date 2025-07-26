// frontend/components/MotionButton.tsx
'use client';
import { motion } from 'framer-motion';

export default function MotionButton({ children, ...props }) {
  return (
    <motion.button
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.96 }}
      transition={{ type: 'spring', stiffness: 400, damping: 10 }}
      {...props}
    >
      {children}
    </motion.button>
  );
}
