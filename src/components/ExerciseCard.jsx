import React from 'react';
import { Dumbbell } from 'lucide-react';
import { motion } from 'framer-motion';

const ExerciseCard = ({ exercise }) => {
  // Validações para evitar undefined
  const instructions = Array.isArray(exercise?.instructions) ? exercise.instructions : [];
  const primaryMuscles = Array.isArray(exercise?.primaryMuscles) ? exercise.primaryMuscles : [];
  const level = exercise?.level || 'Não especificado';
  const equipment = exercise?.equipment || 'Nenhum';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white p-6 rounded-lg shadow-md max-w-md w-full border border-calmGreen"
    >
      <div className="flex items-center gap-3 mb-4">
        <Dumbbell className="w-6 h-6 text-seniorBlue" />
        <h2 className="text-2xl font-semibold text-gray-800">
          {exercise?.name || 'Exercício sem nome'}
        </h2>
      </div>
      <ul className="space-y-2 text-lg text-gray-700">
        {instructions.slice(0, 3).map((step, index) => (
          <li key={index} className="flex items-start gap-2">
            <span className="text-calmGreen">✓</span>
            {step || 'Passo não disponível'}
          </li>
        ))}
        {instructions.length > 3 && (
          <p className="text-sm text-gray-500 italic">...e mais passos!</p>
        )}
      </ul>
      <p className="mt-4 text-base text-gray-600">
        <span className="font-medium">Músculos:</span>{' '}
        {primaryMuscles.length > 0 ? primaryMuscles.join(', ') : 'Não especificado'}
      </p>
      <p className="text-sm text-gray-500 mt-1">
        Nível: {level} | Equipamento: {equipment}
      </p>
    </motion.div>
  );
};

export default ExerciseCard;