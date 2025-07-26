// frontend/components/FadeWrapper.tsx
'use client';
import { motion } from 'framer-motion';

export default function FadeWrapper({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {children}
    </motion.div>
  );
}
