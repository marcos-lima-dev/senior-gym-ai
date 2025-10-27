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
      stream: true, // Informa o proxy que queremos streaming (o proxy lida com isso)
    }, {
      headers: { 'Content-Type': 'application/json' },
      responseType: 'text', // Recebe como texto bruto
    });

    console.log('Resposta bruta da IA:', response.data); // Debug
    let fullResponse = response.data;

    // Tenta parsear o texto acumulado
    try {
      const routineJson = JSON.parse(fullResponse || '{}');
      return routineJson.routine || [];
    } catch (parseError) {
      console.error('Erro ao parsear JSON:', parseError.message);
      // Tenta extrair manualmente se for texto com JSON embutido
      const match = fullResponse.match(/{.*routine.*}/s);
      return match ? JSON.parse(match[0]).routine || [] : [];
    }
  } catch (error) {
    console.error('Erro na IA:', error.message);
    return [];
  }
};