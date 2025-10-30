import React, { useState } from 'react';
import GymAI from './components/GymAI';
import SidebarMenu from './components/SidebarMenu';
import { Menu } from 'lucide-react';

const App = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-green-100 to-blue-200 flex flex-col">
      <header className="bg-seniorBlue text-white p-4 flex justify-between items-center shadow-md">
        <div className="flex items-center gap-2">
          <span role="img" aria-label="halter">🏋️‍♀️</span>
          <div>
            <h1 className="text-xl md:text-2xl font-bold">Senior Gym AI</h1>
            <p className="text-xs md:text-sm opacity-90">Tecnologia e Cuidado em Movimento</p>
          </div>
        </div>
        <button 
          onClick={() => setIsMenuOpen(true)}
          className="p-2 rounded-lg hover:bg-blue-600 transition-colors"
          aria-label="Abrir menu"
        >
          <Menu className="w-6 h-6" />
        </button>
      </header>

      <SidebarMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

      <main className="flex-grow p-4 flex items-center justify-center">
        <GymAI />
      </main>
      
      <footer className="bg-seniorBlue text-white p-4 text-center text-sm md:text-base">
        Senior Gym AI © {new Date().getFullYear()} - Feito com ❤️ para a terceira idade
      </footer>
    </div>
  );
};

export default App;