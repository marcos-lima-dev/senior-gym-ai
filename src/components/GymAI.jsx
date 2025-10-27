import React, { useState, useEffect } from 'react';
import ExerciseCard from './ExerciseCard';
import LoadingSpinner from './LoadingSpinner';
import { generateRoutine } from '../services/ollamaService';
import exercisesData from '../data/exercises.json';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

const GymAI = () => {
  const [filteredExercises, setFilteredExercises] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { transcript, listening, browserSupportsSpeechRecognition } = useSpeechRecognition();

  useEffect(() => {
    if (transcript) setUserInput(transcript); // Atualiza input com voz
    const safeExercises = exercisesData.filter(ex =>
      ex.level === 'iniciante' &&
      (ex.primaryMuscles.includes('abdominais') || ex.primaryMuscles.includes('braços') || ex.primaryMuscles.includes('pernas')) &&
      ex.mechanic === 'isolado'
    );
    setFilteredExercises(safeExercises.slice(0, 5));
  }, [transcript]);

  const handleSubmit = async () => {
    if (!userInput.trim()) return;
    setIsLoading(true);
    const routine = await generateRoutine(userInput, exercisesData);
    setFilteredExercises(routine);
    setIsLoading(false);
  };

  const startListening = () => SpeechRecognition.startListening({ continuous: true, language: 'pt-BR' });
  const stopListening = () => SpeechRecognition.stopListening();

  if (!browserSupportsSpeechRecognition) {
    return <p className="text-lg text-gray-600">Desculpe, seu navegador não suporta reconhecimento de voz.</p>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-green-100 to-blue-200 p-4 flex flex-col items-center">
      <h1 className="text-3xl font-bold text-center mb-8 flex items-center gap-2">
        <span role="img" aria-label="halter">🏋️‍♀️</span> Academia Amiga da Terceira Idade
      </h1>
      <textarea
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
        placeholder="Me conte: O que dói? O que quer fortalecer? (Ex: braços, equilíbrio) Ou fale!"
        className="w-full max-w-md p-4 border rounded-lg text-lg mb-4 resize-none bg-white/80"
        rows={4}
        onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
      />
      <div className="flex gap-2 mb-4">
        <button
          onClick={startListening}
          className="bg-calmGreen text-white p-3 rounded-lg hover:bg-green-600 transition-colors"
          disabled={listening}
        >
          {listening ? 'Escutando...' : 'Falar'}
        </button>
        {listening && (
          <button
            onClick={stopListening}
            className="bg-red-500 text-white p-3 rounded-lg hover:bg-red-600 transition-colors"
          >
            Parar
          </button>
        )}
        <button
          onClick={handleSubmit}
          className="bg-seniorBlue text-white p-3 rounded-lg hover:bg-blue-600 transition-colors disabled:bg-gray-400"
          disabled={isLoading}
        >
          {isLoading ? 'Carregando...' : 'Gerar Rotina'}
        </button>
      </div>
      {isLoading ? (
        <LoadingSpinner />
      ) : filteredExercises.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 w-full max-w-4xl">
          {filteredExercises.map(ex => (
            <ExerciseCard key={ex.id} exercise={ex} />
          ))}
        </div>
      ) : (
        <p className="mt-4 text-lg text-gray-600">Nenhuma rotina gerada ainda. Tente um input!</p>
      )}
    </div>
  );
};

export default GymAI;