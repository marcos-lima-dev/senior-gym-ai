import axios from 'axios';

const API_URL = 'http://localhost:3001/api/ollama-proxy';
const MODEL = 'gpt-oss:120b';

export const generateRoutine = async (userInput, exercises) => {
  try {
    const prompt = `
      Você é um treinador gentil para idosos. Baseado nestes exercícios: 
      ${JSON.stringify(exercises.slice(0, 50))}, 
      gere uma rotina de 3 exercícios seguros para a terceira idade, com foco em "${userInput}". 
      Use linguagem simples, com 8-10 repetições, 5-10min no total, e inclua dicas para evitar dores. 
      Retorne em JSON: { routine: [{ name, instructions, tips }] }.
    `;

    console.log('Enviando prompt para Ollama:', prompt); // Debug
    const response = await axios.post(API_URL, {
      model: MODEL,
      prompt,
    }, {
      headers: { 'Content-Type': 'application/json' },
    });

    console.log('Resposta da IA:', response.data); // Debug
    return response.data.routine || [];
  } catch (error) {
    console.error('Erro na IA:', error.message);
    return [];
  }
};