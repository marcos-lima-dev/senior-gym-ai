import axios from 'axios';

const API_URL = 'http://localhost:3001/api/ollama-proxy';
const MODEL = 'gpt-oss:120b';
const TIMEOUT_MS = 30000;

export const generateRoutine = async (userInput, exercises) => {
  try {
    const filteredExercises = exercises.slice(0, 5);
    const prompt = `
      Você é um treinador gentil para idosos. Baseado nestes exercícios pré-filtrados: 
      ${JSON.stringify(filteredExercises)}, 
      gere UMA E APENAS UMA rotina de EXATAMENTE 3 exercícios seguros para a terceira idade, 
      com foco em: "${userInput}". 
      Use linguagem simples, com 8-10 repetições por exercício, totalizando 5-10 minutos. 
      Inclua dicas para evitar dores e EXPLIQUE BREVEMENTE (2-3 frases) como esses exercícios 
      ajudam no objetivo "${userInput}". 
      **COMECE DIRETAMENTE COM O JSON, SEM NARRATIVA OU TEXTO ADICIONAL ANTES!**
      
      **RETORNE SOMENTE UM JSON VÁLIDO NO FORMATO EXATO ABAIXO:**
      {
        "explanation": "Explicação breve de como os exercícios ajudam no objetivo",
        "routine": [
          {
            "name": "nome_do_exercicio",
            "instructions": ["passo 1", "passo 2", "faça 8 a 10 repetições"],
            "tips": ["dica 1", "dica 2"]
          },
          {
            "name": "nome_do_exercicio",
            "instructions": ["passo 1", "passo 2", "faça 8 a 10 repetições"],
            "tips": ["dica 1", "dica 2"]
          },
          {
            "name": "nome_do_exercicio",
            "instructions": ["passo 1", "passo 2", "faça 8 a 10 repetições"],
            "tips": ["dica 1", "dica 2"]
          }
        ]
      }
    `;

    console.log('Enviando prompt para Ollama:', prompt);
    const response = await axios.post(API_URL, {
      model: MODEL,
      prompt,
      stream: true,
    }, {
      headers: { 'Content-Type': 'application/json' },
      responseType: 'text',
      timeout: TIMEOUT_MS,
    });

    console.log('Resposta bruta da IA:', response.data);
    let fullResponse = '';

    const lines = response.data.split('\n').filter(line => line.trim() !== '');
    lines.forEach(line => {
      try {
        const data = JSON.parse(line);
        fullResponse += (data.response || data.thinking || '');
        console.log('Chunk processado:', { line, data });
        if (data.done) {
          console.log('Stream completo detectado!');
        }
      } catch (lineError) {
        console.error('Erro ao parsear linha:', lineError.message, 'Linha:', line);
      }
    });

    const isComplete = lines.some(line => line.includes('"done":true'));
    if (!isComplete) {
      console.warn('Resposta incompleta do Ollama, pode estar truncada.');
    }

    console.log('Resposta acumulada antes do parse:', fullResponse);
    try {
      const routineJson = JSON.parse(fullResponse);
      console.log('JSON parseado com sucesso:', routineJson);
      if (!routineJson.explanation || !routineJson.routine || !Array.isArray(routineJson.routine) || routineJson.routine.length !== 3) {
        throw new Error('JSON inválido: deve ter explanation e exatamente 3 exercícios.');
      }
      return routineJson;
    } catch (parseError) {
      console.error('Erro ao parsear JSON final:', parseError.message, 'Conteúdo:', fullResponse);
      const match = fullResponse.match(/{[\s\S]*"explanation"[\s\S]*"routine"[\s\S]*}/);
      if (match) {
        console.log('JSON parcial extraído:', match[0]);
        const partialJson = JSON.parse(match[0]);
        if (partialJson.explanation && partialJson.routine && Array.isArray(partialJson.routine) && partialJson.routine.length === 3) {
          return partialJson;
        }
      }
      return { explanation: '', routine: [] };
    }
  } catch (error) {
    console.error('Erro na IA:', error.message);
    if (error.message.includes('timeout')) {
      console.warn('Timeout atingido – considere reduzir o prompt ou usar um modelo mais leve.');
    } else if (error.response?.status === 401) {
      console.warn('Erro 401 – verifique a API key no .env.');
    }
    return { explanation: '', routine: [] };
  }
};