/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",  // Escaneia seus components
  ],
  theme: {
    extend: {
      colors: {
        seniorBlue: '#3B82F6',  // Azul suave pra botões
        calmGreen: '#10B981',   // Verde pra checks de exercícios
      },
      fontSize: {
        'xl': '1.25rem',  // Padrão maior pra legibilidade
      },
    },
  },
  plugins: [],
}