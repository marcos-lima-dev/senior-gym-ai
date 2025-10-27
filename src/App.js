import React from 'react';
import GymAI from './components/GymAI';
import { Menu } from 'lucide-react';

const App = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-green-100 to-blue-200 flex flex-col">
      <header className="bg-seniorBlue text-white p-4 flex justify-between items-center shadow-md">
        <div className="flex items-center gap-2">
          <span role="img" aria-label="halter">🏋️‍♀️</span>
          <h1 className="text-2xl font-bold">Academia Amiga</h1>
        </div>
        <button className="p-2 rounded-lg hover:bg-blue-600">
          <Menu className="w-6 h-6" />
        </button>
      </header>
      <main className="flex-grow p-4 flex items-center justify-center">
        <GymAI />
      </main>
      <footer className="bg-seniorBlue text-white p-4 text-center text-base">
        Feito com ❤️ para a terceira idade - {new Date().toLocaleDateString('pt-BR')}
      </footer>
    </div>
  );
};

export default App;