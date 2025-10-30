# 🚀 Guia Completo: Next.js + Tailwind + Shadcn + Lucide + Animações

## 📋 Pré-requisitos
- Node.js 18+ instalado
- npm, yarn ou pnpm

---

## 1️⃣ Criar o Projeto Next.js com Tailwind

```bash
npx create-next-app@latest senior-gym-ai-nextjs
```

**Durante a instalação, selecione:**
- ✅ TypeScript? **Yes**
- ✅ ESLint? **Yes**
- ✅ Tailwind CSS? **Yes**
- ✅ `src/` directory? **Yes** (recomendado)
- ✅ App Router? **Yes**
- ❌ Customize default import alias? **No**

```bash
cd senior-gym-ai-nextjs
```

---

## 2️⃣ Instalar Shadcn/ui

### Inicializar Shadcn
```bash
npx shadcn@latest init
```

**Configurações recomendadas:**
- Style: **New York** ou **Default** (escolha sua preferência)
- Base color: **Slate** (ou sua preferência)
- CSS variables: **Yes**

### Instalar componentes mais usados
```bash
# Componentes básicos
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add input
npx shadcn@latest add label
npx shadcn@latest add select
npx shadcn@latest add dialog
npx shadcn@latest add dropdown-menu
npx shadcn@latest add avatar
npx shadcn@latest add badge
npx shadcn@latest add tabs
npx shadcn@latest add accordion
npx shadcn@latest add alert
npx shadcn@latest add toast
npx shadcn@latest add skeleton
npx shadcn@latest add progress
```

---

## 3️⃣ Instalar Lucide Icons

```bash
npm install lucide-react
```

**Uso:**
```tsx
import { Dumbbell, User, Calendar } from 'lucide-react'

<Dumbbell className="w-6 h-6" />
```

---

## 4️⃣ Configurar Animações

### Opção A: Framer Motion (mais completa)
```bash
npm install framer-motion
```

**Exemplo de uso:**
```tsx
import { motion } from 'framer-motion'

<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
>
  Conteúdo
</motion.div>
```

### Opção B: Apenas Tailwind (mais leve)
Tailwind já vem com animações básicas:
```tsx
<div className="animate-fade-in animate-slide-up hover:scale-105 transition-transform">
  Conteúdo
</div>
```

### Adicionar animações customizadas no Tailwind
Edite `tailwind.config.ts`:
```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.5s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
```

---

## 5️⃣ Estrutura de Pastas Recomendada

```
src/
├── app/
│   ├── layout.tsx          # Layout principal
│   ├── page.tsx            # Página inicial
│   ├── treinos/
│   │   └── page.tsx
│   ├── exercicios/
│   │   └── page.tsx
│   └── api/                # Rotas de API
│       └── generate/
│           └── route.ts
├── components/
│   ├── ui/                 # Componentes Shadcn
│   ├── treinos/
│   │   ├── TreinoCard.tsx
│   │   └── ExercicioList.tsx
│   └── layout/
│       ├── Header.tsx
│       └── Footer.tsx
├── lib/
│   ├── utils.ts            # Funções utilitárias
│   └── gemini.ts           # Configuração Gemini AI
├── types/
│   └── index.ts            # TypeScript types
└── styles/
    └── globals.css
```

---

## 6️⃣ Configurar Variáveis de Ambiente

Crie `.env.local`:
```env
GEMINI_API_KEY=sua_chave_aqui
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 7️⃣ Rodar o Projeto

```bash
npm run dev
```

Acesse: `http://localhost:3000`

---

## 8️⃣ Exemplo de Componente Completo

```tsx
'use client'

import { motion } from 'framer-motion'
import { Dumbbell, Clock, Flame } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function TreinoCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Dumbbell className="w-5 h-5 text-blue-600" />
            Treino de Força
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-4">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-gray-500" />
              <span className="text-sm">30 min</span>
            </div>
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-orange-500" />
              <span className="text-sm">Moderado</span>
            </div>
          </div>
          <Button className="w-full">Iniciar Treino</Button>
        </CardContent>
      </Card>
    </motion.div>
  )
}
```

---

## 9️⃣ Dicas Importantes

### Performance
- Use `'use client'` apenas em componentes com interatividade
- Componentes sem estado podem ser Server Components
- Use `loading.tsx` e `error.tsx` para melhor UX

### Shadcn
- Componentes ficam em `src/components/ui/`
- Você pode customizar TUDO editando os arquivos
- Use `className` para sobrescrever estilos

### Lucide Icons
- Mais de 1000 ícones disponíveis
- Totalmente otimizados
- Fácil customização: `<Icon className="w-6 h-6 text-blue-500" />`

### Animações
- Use Framer Motion para animações complexas
- Use Tailwind para transições simples
- Evite animar muitos elementos ao mesmo tempo

---

## 🔧 Scripts Úteis

```bash
# Desenvolvimento
npm run dev

# Build de produção
npm run build

# Rodar build local
npm start

# Lint
npm run lint

# Adicionar componente Shadcn
npx shadcn@latest add [component-name]
```

---

## 📦 Dependências Finais

```json
{
  "dependencies": {
    "next": "^14.x",
    "react": "^18.x",
    "react-dom": "^18.x",
    "lucide-react": "latest",
    "framer-motion": "^11.x",
    "tailwindcss": "^3.x",
    "@radix-ui/*": "latest"
  }
}
```

---

## ✅ Checklist de Instalação

- [ ] Criar projeto Next.js com Tailwind
- [ ] Inicializar Shadcn
- [ ] Instalar componentes Shadcn necessários
- [ ] Instalar Lucide React
- [ ] Instalar Framer Motion
- [ ] Configurar animações customizadas no Tailwind
- [ ] Criar estrutura de pastas
- [ ] Configurar `.env.local`
- [ ] Testar com `npm run dev`

---

## 🎯 Próximos Passos

1. Migrar componentes do projeto React antigo
2. Adaptar rotas para App Router
3. Implementar API routes se necessário
4. Configurar integração com Gemini AI
5. Adicionar testes (opcional)

Bora codar! 🚀