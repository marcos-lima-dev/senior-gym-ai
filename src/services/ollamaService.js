import axios from 'axios';

const API_URL = 'http://localhost:3001/api/ollama-proxy';
const MODEL = 'gpt-oss:120b';
const TIMEOUT_MS = 20000; // Tempo limite de 20s pra evitar travamentos

export const generateRoutine = async (userInput, exercises) => {
  try {
    const prompt = `
      Você é um treinador gentil para idosos. Baseado nestes exercícios pré-filtrados: 
      ${JSON.stringify(exercises)}, 
      gere uma rotina de 3 exercícios seguros para a terceira idade, com foco em "${userInput}". 
      Use linguagem simples, com 8-10 repetições, 5-10min no total, e inclua dicas para evitar dores. 
      Retorne em JSON: { routine: [{ name, instructions, tips }] }.
    `;

    console.log('Enviando prompt para Ollama:', prompt); // Log do prompt enviado
    const response = await axios.post(API_URL, {
      model: MODEL,
      prompt,
      stream: true, // Indica que queremos streaming
    }, {
      headers: { 'Content-Type': 'application/json' },
      responseType: 'text', // Recebe como texto bruto pra processar linhas
      timeout: TIMEOUT_MS,
    });

    console.log('Resposta bruta da IA:', response.data); // Log da resposta completa
    let fullResponse = '';

    // Processa a resposta linha por linha
    const lines = response.data.split('\n').filter(line => line.trim() !== '');
    lines.forEach(line => {
      try {
        const data = JSON.parse(line); // Parseia cada linha individualmente
        fullResponse += (data.response || data.thinking || ''); // Junta o conteúdo útil
        console.log('Chunk processado:', data); // Debug por chunk
        if (data.done) {
          console.log('Stream completo detectado!'); // Confirma fim do stream
        }
      } catch (lineError) {
        console.error('Erro ao parsear linha:', lineError.message, 'Linha:', line); // Log de erro por linha
      }
    });

    // Verifica se o stream foi completo
    const isComplete = lines.some(line => line.includes('"done":true'));
    if (!isComplete) {
      console.warn('Resposta incompleta do Ollama, pode estar truncada. Usando o que foi recebido.');
    }

    // Tenta parsear a resposta acumulada
    try {
      const routineJson = JSON.parse(fullResponse || '{}');
      return routineJson.routine || [];
    } catch (parseError) {
      console.error('Erro ao parsear JSON final:', parseError.message);
      // Tenta extrair um JSON válido se houver
      const match = fullResponse.match(/{.*routine.*}/s);
      return match ? JSON.parse(match[0]).routine || [] : [];
    }
  } catch (error) {
    console.error('Erro na IA:', error.message);
    if (error.message.includes('timeout')) {
      console.warn('Timeout atingido – considere reduzir o prompt ou usar um modelo mais leve.');
    } else if (error.response?.status === 401) {
      console.warn('Erro 401 – verifique a API key no .env.');
    }
    return [];
  }
};