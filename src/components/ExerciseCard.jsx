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
      className="bg-white p-6 rounded-3xl shadow-xl w-full border-2 border-blue-100"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="bg-blue-100 rounded-full p-3">
          <Dumbbell className="w-6 h-6 text-blue-600" />
        </div>
        <h2 className="text-xl md:text-2xl font-bold text-gray-800">
          {exercise?.name || 'Exercício sem nome'}
        </h2>
      </div>
      
      <ul className="space-y-3 mb-4">
        {instructions.map((step, index) => (
          <li key={index} className="flex items-start gap-3">
            <span className="text-green-500 font-bold text-xl flex-shrink-0 mt-0.5">✓</span>
            <span className="text-lg text-gray-700 leading-relaxed">
              {step || 'Passo não disponível'}
            </span>
          </li>
        ))}
      </ul>

      <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-100">
        <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold">
          {primaryMuscles.length > 0 ? primaryMuscles.join(', ') : 'Não especificado'}
        </span>
        <span className="bg-gray-100 text-gray-700 px-4 py-2 rounded-full text-sm font-medium">
          {level}
        </span>
        <span className="bg-gray-100 text-gray-700 px-4 py-2 rounded-full text-sm font-medium">
          {equipment}
        </span>
      </div>
    </motion.div>
  );
};

export default ExerciseCard;