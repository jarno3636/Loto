'use client';

import { motion } from 'framer-motion';

interface MotionButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  title?: string;
  type?: 'button' | 'submit';
}

export default function MotionButton({
  children,
  onClick,
  disabled,
  className = '',
  title,
  type = 'button',
}: MotionButtonProps) {
  return (
    <motion.button
      type={type}
      title={title}
      onClick={onClick}
      disabled={disabled}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`transition-all duration-200 px-4 py-2 rounded font-semibold bg-violet-600 hover:bg-violet-700 text-white disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {children}
    </motion.button>
  );
}
