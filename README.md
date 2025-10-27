# 🏋️‍♀️ Senior Gym AI

Bem-vindo à **Academia Amiga da Terceira Idade**! Este é um app web desenvolvido para ajudar pessoas da terceira idade a criar rotinas de exercícios seguras e personalizadas, usando IA e um banco de dados open-source em português. Inspirado em projetos como o [Chef IA](https://github.com/seu-usuario/chef-ia) (se aplicável), ele combina tecnologia acessível com foco em bem-estar.

## 🎯 O que é isso?
O **Senior Gym AI** é uma ferramenta que:
- Filtra exercícios simples (ex.: "Abdominal 3/4", "Isquiotibiais 90/90") de um dataset de mais de 800 opções.
- Usa IA (Ollama) pra gerar rotinas personalizadas baseadas em inputs como "braços" ou "equilíbrio".
- Oferece interface amigável, com voz e design acessível pra idosos.
- É open-source e feito com ❤️ pra democratizar a saúde física.

## 🚀 Status Atual
- **MVP em progresso**: Input de texto e geração de rotinas via IA funcionando (com ajustes de CORS em andamento).
- **Funcionalidades futuras**: Input por voz, imagens nos exercícios, e histórico de rotinas.

## 🛠️ Tecnologias
- **Frontend**: React 18, Tailwind CSS (mobile-first), Framer Motion (animações).
- **IA**: Ollama Cloud (via proxy local).
- **Dados**: [exercicios-bd-ptbr](https://github.com/joao-gugel/exercicios-bd-ptbr) (mais de 800 exercícios em PT-BR).
- **Ferramentas**: Node.js, npm, GitHub Actions (em planejamento).

## 📋 Como Usar
1. **Clone o repo**:
   ```bash
   git clone https://github.com/marcos-lima-dev/senior-gym-ai.git
   cd senior-gym-ai