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
  const [voiceError, setVoiceError] = useState(null);
  const [routineExplanation, setRoutineExplanation] = useState(''); // Novo estado
  const { transcript, listening, browserSupportsSpeechRecognition } = useSpeechRecognition();

  useEffect(() => {
    if (transcript) {
      setUserInput(transcript);
    }

    // Mapeamento semântico para melhorar o filtro
    const muscleMapping = {
      'braço': ['biceps', 'triceps', 'antebraços', 'braços'],
      'perna': ['quadriceps', 'isquiotibiais', 'panturrilhas', 'pernas', 'coxa'],
      'abdominal': ['abdominais', 'core', 'oblíquos'],
      'costas': ['dorsais', 'trapézio', 'lombar', 'costas'],
      'ombro': ['deltoides', 'ombros'],
      'peito': ['peitorais', 'peito'],
      'equilíbrio': ['core', 'pernas', 'tornozelos'],
      'joelho': ['quadriceps', 'isquiotibiais'],
      'subir a escada': ['quadriceps', 'glúteos', 'pernas'], // Novo mapeamento
    };

    // Normaliza o input
    const normalizedInput = userInput.toLowerCase().trim();
    
    // Busca palavras-chave no mapeamento
    let targetMuscles = [];
    Object.keys(muscleMapping).forEach(key => {
      if (normalizedInput.includes(key)) {
        targetMuscles.push(...muscleMapping[key]);
      }
    });

    // Fallback se não encontrar nada específico
    if (targetMuscles.length === 0) {
      targetMuscles = [normalizedInput];
    }

    // Filtra exercícios relevantes
    const safeExercises = exercisesData.filter(ex => 
      ex.level === 'iniciante' && 
      targetMuscles.some(muscle => 
        ex.primaryMuscles?.some(pm => pm.toLowerCase().includes(muscle.toLowerCase()))
      )
    ).slice(0, 10);

    setFilteredExercises(safeExercises);
  }, [transcript, userInput]);

  const handleSubmit = async () => {
    if (!userInput.trim()) return;
    if (listening) stopListening();
    setIsLoading(true);
    try {
      const routine = await generateRoutine(userInput, filteredExercises); // Fix crítico
      if (routine.explanation) {
        setRoutineExplanation(routine.explanation); // Seta explicação da IA
      }
      const enrichedRoutine = routine.routine.map(ex => {
        const normalizedName = ex.name?.toLowerCase().trim();
        const originalEx = exercisesData.find(e => 
          e.name.toLowerCase().trim() === normalizedName
        );
        return {
          ...originalEx, // Mantém dados originais como fallback
          ...ex, // Sobrescreve com os dados da IA, preservando instructions e tips
          id: originalEx?.id || ex.id || Date.now() + Math.random(),
          primaryMuscles: ex.primaryMuscles || originalEx?.primaryMuscles || [],
          instructions: ex.instructions || originalEx?.instructions || [],
          tips: ex.tips || originalEx?.tips || [],
        };
      });
      setFilteredExercises(enrichedRoutine);
    } catch (error) {
      console.error('Erro ao gerar rotina:', error);
      setVoiceError('Ops, algo deu errado ao gerar a rotina. Tente novamente!');
    } finally {
      setIsLoading(false);
    }
  };

  const startListening = () => {
    console.log('Iniciando reconhecimento de voz...');
    SpeechRecognition.startListening({ continuous: true, language: 'pt-BR' });
  };

  const stopListening = () => {
    console.log('Parando reconhecimento de voz.');
    SpeechRecognition.stopListening();
  };

  if (!browserSupportsSpeechRecognition) {
    setVoiceError('Desculpe, seu navegador não suporta reconhecimento de voz.');
    return <p className="text-red-500">{voiceError}</p>;
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
      {voiceError && <p className="text-red-500 mb-4">{voiceError}</p>}
      {isLoading ? (
        <LoadingSpinner />
      ) : filteredExercises.length > 0 ? (
        <>
          {/* Explicação dinâmica gerada pela IA */}
          {routineExplanation && (
            <div className="bg-white p-4 rounded-lg shadow-md max-w-md w-full mb-6 border border-calmGreen">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Como esses exercícios te ajudam?</h2>
              <p className="text-gray-700">{routineExplanation}</p>
            </div>
          )}
          {/* Grid de cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 w-full max-w-4xl">
            {filteredExercises.map(ex => (
              <ExerciseCard key={ex.id} exercise={ex} />
            ))}
          </div>
        </>
      ) : (
        <p className="mt-4 text-lg text-gray-600">Nenhuma rotina gerada ainda. Tente um input!</p>
      )}
    </div>
  );
};

export default GymAI;