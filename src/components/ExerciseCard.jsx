import React from 'react';
import { Dumbbell } from 'lucide-react';
import { motion } from 'framer-motion';

const ExerciseCard = ({ exercise }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white p-6 rounded-lg shadow-md max-w-md w-full border border-calmGreen"
    >
      <div className="flex items-center gap-3 mb-4">
        <Dumbbell className="w-6 h-6 text-seniorBlue" />
        <h2 className="text-2xl font-semibold text-gray-800">{exercise.name}</h2>
      </div>
      <ul className="space-y-2 text-lg text-gray-700">
        {exercise.instructions.slice(0, 3).map((step, index) => (
          <li key={index} className="flex items-start gap-2">
            <span className="text-calmGreen">✓</span>
            {step}
          </li>
        ))}
        {exercise.instructions.length > 3 && (
          <p className="text-sm text-gray-500 italic">...e mais passos!</p>
        )}
      </ul>
      <p className="mt-4 text-base text-gray-600">
        <span className="font-medium">Músculos:</span>{' '}
        {exercise.primaryMuscles.join(', ')}
      </p>
      <p className="text-sm text-gray-500 mt-1">
        Nível: {exercise.level} | Equipamento: {exercise.equipment || 'Nenhum'}
      </p>
    </motion.div>
  );
};

export default ExerciseCard;