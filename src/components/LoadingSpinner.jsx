import React from 'react';
import { motion } from 'framer-motion';

const LoadingSpinner = () => {
  const messages = [
    'Analisando seus objetivos...',
    'Escolhendo exercícios seguros...',
    'Montando sua rotina perfeita...',
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center min-h-[200px]"
    >
      <div className="w-12 h-12 border-4 border-calmGreen border-t-transparent rounded-full animate-spin" />
      <p className="mt-4 text-lg text-gray-700 font-medium">
        {messages[Math.floor(Math.random() * messages.length)]}
      </p>
    </motion.div>
  );
};

export default LoadingSpinner;