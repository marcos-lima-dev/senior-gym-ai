const express = require('express');
const axios = require('axios');
require('dotenv').config();
const cors = require('cors');

const app = express();
const PORT = 3001;

app.use(express.json());
app.use(cors());

app.post('/api/ollama-proxy', async (req, res) => {
  try {
    const apiKey = process.env.REACT_APP_OLLAMA_API_KEY;
    if (!apiKey) {
      throw new Error('API key não encontrada no .env');
    }
    console.log('Usando key (primeiros 10 chars):', apiKey.substring(0, 10) + '...');

    const ollamaResponse = await axios.post('https://ollama.com/api/generate', req.body, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      responseType: 'stream', // Garante que o proxy receba como stream
    });

    ollamaResponse.data.pipe(res); // Envia o stream direto pro frontend
  } catch (error) {
    console.error('Erro no proxy (detalhes):', error.response?.data || error.message);
    res.status(500).json({ error: 'Erro ao conectar com Ollama: ' + (error.response?.status || error.message) });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Proxy server running on http://localhost:${PORT}`);
  console.log(`🔧 Endpoint: http://localhost:${PORT}/api/ollama-proxy`);
});