import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Sparkles, Heart, Dumbbell, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ExerciseCard from './ExerciseCard';
import { generateRoutine } from '../services/ollamaService';
import exercisesData from '../data/exercises.json';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

const GymAI = () => {
  const [filteredExercises, setFilteredExercises] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [voiceError, setVoiceError] = useState(null);
  const [routineExplanation, setRoutineExplanation] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
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
      'subir escada': ['quadriceps', 'glúteos', 'pernas'],
      'escada': ['quadriceps', 'glúteos', 'pernas'],
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
    setShowSuccess(false);
    try {
      // FIX CRÍTICO: Envia filteredExercises, não exercisesData
      const result = await generateRoutine(userInput, filteredExercises);
      
      if (result.explanation) {
        setRoutineExplanation(result.explanation);
      }
      
      // Enriquece a rotina com dados originais
      const enrichedRoutine = result.routine.map(ex => {
        const normalizedName = ex.name?.toLowerCase().trim();
        const originalEx = exercisesData.find(e => 
          e.name.toLowerCase().trim() === normalizedName
        );
        return {
          ...originalEx,
          ...ex,
          id: originalEx?.id || ex.id || Date.now() + Math.random(),
          primaryMuscles: ex.primaryMuscles || originalEx?.primaryMuscles || [],
          instructions: ex.instructions || originalEx?.instructions || [],
          tips: ex.tips || originalEx?.tips || [],
        };
      });
      
      setFilteredExercises(enrichedRoutine);
      setShowSuccess(true);
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
    return (
      <div className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-br from-rose-50 to-orange-50">
        <div className="bg-white p-6 rounded-2xl shadow-lg max-w-md">
          <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-4" />
          <p className="text-xl text-gray-800 text-center">
            Desculpe, seu navegador não suporta reconhecimento de voz.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-blue-100 p-4 pb-24">
      {/* Header Compacto */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="max-w-2xl mx-auto mb-6"
      >
        <div className="flex flex-col items-center gap-2 mb-2">
          <div className="flex items-center gap-3">
            <Dumbbell className="w-8 h-8 text-blue-600" />
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
              Senior Gym AI
            </h1>
          </div>
          <p className="text-center text-gray-600 text-sm font-medium">
            Tecnologia e Cuidado em Movimento
          </p>
        </div>
      </motion.div>

      {/* Input Humanizado */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="max-w-2xl mx-auto mb-6"
      >
        <div className="bg-white rounded-3xl shadow-xl p-6 border-2 border-blue-100">
          <label className="block text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <Heart className="w-5 h-5 text-rose-500" />
            Me conte o que você precisa
          </label>
          <textarea
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Ex: Preciso de força para subir escadas
Quero fortalecer meus braços
Melhorar meu equilíbrio..."
            className="w-full p-4 border-2 border-gray-200 rounded-2xl text-lg resize-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100 transition-all outline-none"
            rows={4}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit();
              }
            }}
          />
          
          {/* Indicador de voz ativa */}
          <AnimatePresence>
            {listening && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mt-3 flex items-center gap-2 text-green-600"
              >
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 1 }}
                  className="w-3 h-3 bg-green-500 rounded-full"
                />
                <span className="text-sm font-medium">Escutando você...</span>
              </motion.div>
            )}
          </AnimatePresence>

          {voiceError && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-3 text-rose-600 text-sm flex items-center gap-2"
            >
              <AlertCircle className="w-4 h-4" />
              {voiceError}
            </motion.p>
          )}
        </div>
      </motion.div>

      {/* Botões Ultra Design */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="max-w-2xl mx-auto mb-8"
      >
        <div className="grid grid-cols-2 gap-3">
          {/* Botão de Voz */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={listening ? stopListening : startListening}
            className={`
              relative overflow-hidden rounded-2xl p-4 font-bold text-lg shadow-lg
              transition-all duration-300 transform hover:scale-105
              ${listening 
                ? 'bg-gradient-to-br from-rose-500 to-rose-600 text-white' 
                : 'bg-gradient-to-br from-green-500 to-green-600 text-white'
              }
            `}
          >
            <div className="flex flex-col items-center gap-2">
              {listening ? (
                <MicOff className="w-8 h-8" />
              ) : (
                <Mic className="w-8 h-8" />
              )}
              <span className="text-sm">
                {listening ? 'Parar de Falar' : 'Falar Agora'}
              </span>
            </div>
            {listening && (
              <motion.div
                className="absolute inset-0 bg-white opacity-20"
                animate={{ scale: [1, 1.5, 1], opacity: [0.2, 0, 0.2] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              />
            )}
          </motion.button>

          {/* Botão de Gerar */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleSubmit}
            disabled={isLoading || !userInput.trim()}
            className={`
              relative overflow-hidden rounded-2xl p-4 font-bold text-lg shadow-lg
              transition-all duration-300 transform hover:scale-105
              ${isLoading || !userInput.trim()
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-br from-blue-500 to-blue-600 text-white'
              }
            `}
          >
            <div className="flex flex-col items-center gap-2">
              <Sparkles className="w-8 h-8" />
              <span className="text-sm">
                {isLoading ? 'Criando...' : 'Criar Rotina'}
              </span>
            </div>
            {isLoading && (
              <motion.div
                className="absolute inset-0 bg-white opacity-20"
                animate={{ x: ['-100%', '100%'] }}
                transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
              />
            )}
          </motion.button>
        </div>

        {/* Dica de uso */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center text-gray-600 text-sm mt-4"
        >
          💡 Dica: Pressione Enter para criar ou clique em "Falar Agora"
        </motion.p>
      </motion.div>

      {/* Loading Animado */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-2xl mx-auto"
          >
            <div className="bg-white rounded-3xl shadow-xl p-8 border-2 border-blue-100">
              <div className="flex flex-col items-center gap-4">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
                  className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full"
                />
                <motion.p
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="text-lg font-medium text-gray-700"
                >
                  Analisando seus objetivos...
                </motion.p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Resultado com Sucesso */}
      <AnimatePresence>
        {showSuccess && !isLoading && filteredExercises.length > 0 && (
          <>
            {/* Banner de Sucesso */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-2xl mx-auto mb-6"
            >
              <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-2xl shadow-xl p-4">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-8 h-8" />
                  <div>
                    <p className="font-bold text-lg">Rotina criada com sucesso!</p>
                    <p className="text-sm opacity-90">{filteredExercises.length} exercícios personalizados para você</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Explicação Dinâmica */}
            {routineExplanation && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="max-w-2xl mx-auto mb-6"
              >
                <div className="bg-white rounded-3xl shadow-xl p-6 border-2 border-green-100">
                  <h2 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
                    <Sparkles className="w-6 h-6 text-green-500" />
                    Como esses exercícios te ajudam?
                  </h2>
                  <p className="text-gray-700 leading-relaxed text-lg">
                    {routineExplanation}
                  </p>
                </div>
              </motion.div>
            )}

            {/* Cards de Exercícios */}
            <div className="max-w-2xl mx-auto space-y-4">
              {filteredExercises.map((ex, index) => (
                <motion.div
                  key={ex.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                >
                  <ExerciseCard exercise={ex} />
                </motion.div>
              ))}
            </div>
          </>
        )}
      </AnimatePresence>

      {/* Estado Vazio */}
      {!isLoading && !showSuccess && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="max-w-2xl mx-auto"
        >
          <div className="bg-white/50 rounded-3xl p-8 text-center border-2 border-dashed border-gray-300">
            <Dumbbell className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">
              Nenhuma rotina gerada ainda.
            </p>
            <p className="text-gray-500 text-sm mt-2">
              Comece falando ou digitando o que você precisa!
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default GymAI;