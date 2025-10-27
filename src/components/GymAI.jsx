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
  const { transcript, listening, browserSupportsSpeechRecognition } = useSpeechRecognition();

  useEffect(() => {
    if (transcript) {
      console.log('Transcript recebido:', transcript); // Debug voz
      setUserInput(transcript);
    }
    // Filtra exercícios relevantes antes de enviar
    const safeExercises = exercisesData.filter(ex => 
      ex.level === 'iniciante' && // Só iniciante pra idosos
      (ex.primaryMuscles.includes(userInput.toLowerCase()) || 
       (userInput.toLowerCase().includes('braço') && ex.primaryMuscles.includes('braços')) ||
       (userInput.toLowerCase().includes('perna') && ex.primaryMuscles.includes('pernas')) ||
       (userInput.toLowerCase().includes('abdomin') && ex.primaryMuscles.includes('abdominais')))
    ).slice(0, 10); // Limita a 10 pra otimizar
    setFilteredExercises(safeExercises);
  }, [transcript, userInput]);

  const handleSubmit = async () => {
    if (!userInput.trim()) return;
    if (listening) stopListening(); // Para a voz automaticamente se estiver escutando
    setIsLoading(true);
    try {
      const routine = await generateRoutine(userInput, exercisesData);
      // Mescla os dados originais com a rotina gerada, normalizando e validando
      const enrichedRoutine = routine.map(ex => {
        const normalizedName = ex.name?.toLowerCase().trim();
        const originalEx = exercisesData.find(e => 
          e.name.toLowerCase().trim() === normalizedName
        );
        return originalEx ? {
          ...originalEx,
          ...ex,
          id: originalEx.id || ex.id || Date.now() + Math.random(), // Garante chave única
          primaryMuscles: Array.isArray(ex.primaryMuscles) ? ex.primaryMuscles : originalEx.primaryMuscles || [],
          instructions: Array.isArray(ex.instructions) ? ex.instructions : originalEx.instructions || [],
          tips: Array.isArray(ex.tips) ? ex.tips : originalEx.tips || [],
        } : {
          ...ex,
          id: ex.id || Date.now() + Math.random(), // Fallback se não encontrar
          primaryMuscles: [],
          instructions: [],
          tips: [],
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
          {/* Explicação antes dos cards */}
          <div className="bg-white p-4 rounded-lg shadow-md max-w-md w-full mb-6 border border-calmGreen">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">O que esses exercícios trabalham?</h2>
            <p className="text-gray-700">
              Esses exercícios foram escolhidos pra te dar mais força pra remada em canoa! Veja como eles ajudam:
              <ul className="list-disc pl-5 mt-2">
                <li>
                  <strong>Rosca Martelo Alternada</strong>: Fortalece os <strong>bíceps</strong> (músculos da frente do braço) e um pouco os antebraços. Isso ajuda a puxar o remo com mais força!
                </li>
                <li>
                  <strong>Abdominal 3/4</strong>: Trabalha o <strong>core</strong> (barriga e cintura), dando estabilidade pra manter a postura ao remar.
                </li>
                <li>
                  <strong>Roda Abdominal</strong>: Também fortalece o <strong>core</strong> e um pouco os <strong>ombros</strong>, ajudando no equilíbrio e na resistência na remada.
                </li>
              </ul>
              <p className="mt-2 text-gray-600">
                Com 8 a 10 repetições cada, em 5-10 minutos, você vai ganhando força de forma segura e tranquila!
              </p>
            </p>
          </div>
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