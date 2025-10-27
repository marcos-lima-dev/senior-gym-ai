const express = require('express');
const axios = require('axios');
require('dotenv').config();
const cors = require('cors'); // Adiciona o módulo CORS

const app = express();
const PORT = 3001;

app.use(express.json());
app.use(cors()); // Habilita CORS para todas as origens (para teste; ajuste depois)

app.post('/api/ollama-proxy', async (req, res) => {
  try {
    // Endpoint do Ollama Cloud para geração de texto
    const response = await axios.post('https://ollama.com/api/generate', req.body, {
      headers: {
        Authorization: `Bearer ${process.env.REACT_APP_OLLAMA_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });
    res.json(response.data);
  } catch (error) {
    console.error('Erro no proxy:', error.message);
    res.status(500).json({ error: 'Erro ao conectar com Ollama' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Proxy server running on http://localhost:${PORT}`);
  console.log(`🔧 Endpoint: http://localhost:${PORT}/api/ollama-proxy`);
});