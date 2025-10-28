import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  History, 
  Settings, 
  Download, 
  Info, 
  Heart,
  ChevronRight,
  Trash2,
  FileText
} from 'lucide-react';

const SidebarMenu = ({ isOpen, onClose }) => {
  const [historyItems, setHistoryItems] = useState([
    { id: 1, title: 'Rotina para subir escadas', date: '27/10/2025', exercises: 3 },
    { id: 2, title: 'Fortalecimento de braços', date: '26/10/2025', exercises: 3 },
    { id: 3, title: 'Exercícios de equilíbrio', date: '25/10/2025', exercises: 3 },
  ]);

  const [fontSize, setFontSize] = useState('normal');
  const [highContrast, setHighContrast] = useState(false);

  const clearHistory = () => {
    if (window.confirm('Deseja realmente limpar todo o histórico?')) {
      setHistoryItems([]);
    }
  };

  const deleteItem = (id) => {
    setHistoryItems(historyItems.filter(item => item.id !== id));
  };

  const exportToPDF = () => {
    alert('Funcionalidade de exportação para PDF em desenvolvimento!\n\nEm breve você poderá salvar suas rotinas em PDF.');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed left-0 top-0 bottom-0 w-80 md:w-96 bg-white shadow-2xl z-50 overflow-y-auto"
          >
            {/* Header do Menu */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 sticky top-0 z-10">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Heart className="w-6 h-6" />
                  <h2 className="text-xl font-bold">Menu</h2>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-white/20 transition-colors"
                  aria-label="Fechar menu"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <p className="text-sm opacity-90">Senior Gym AI</p>
            </div>

            {/* Conteúdo do Menu */}
            <div className="p-4 space-y-6">
              
              {/* Seção: Histórico */}
              <section>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                    <History className="w-5 h-5 text-blue-600" />
                    Histórico de Rotinas
                  </h3>
                  {historyItems.length > 0 && (
                    <button
                      onClick={clearHistory}
                      className="text-rose-600 hover:text-rose-700 text-sm font-medium"
                    >
                      Limpar
                    </button>
                  )}
                </div>
                
                {historyItems.length === 0 ? (
                  <div className="bg-gray-50 rounded-xl p-4 text-center">
                    <FileText className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                    <p className="text-gray-500 text-sm">Nenhuma rotina no histórico</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {historyItems.map((item) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="bg-gray-50 rounded-xl p-3 hover:bg-gray-100 transition-colors group"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <p className="font-medium text-gray-800 text-sm mb-1">
                              {item.title}
                            </p>
                            <p className="text-xs text-gray-500">
                              {item.date} • {item.exercises} exercícios
                            </p>
                          </div>
                          <div className="flex gap-1">
                            <button
                              onClick={() => deleteItem(item.id)}
                              className="p-1.5 rounded-lg hover:bg-rose-100 text-rose-600 opacity-0 group-hover:opacity-100 transition-opacity"
                              aria-label="Deletar"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                            <button
                              className="p-1.5 rounded-lg hover:bg-blue-100 text-blue-600"
                              aria-label="Ver detalhes"
                            >
                              <ChevronRight className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </section>

              {/* Seção: Configurações */}
              <section>
                <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2 mb-3">
                  <Settings className="w-5 h-5 text-blue-600" />
                  Configurações
                </h3>
                
                <div className="space-y-3">
                  {/* Tamanho da Fonte */}
                  <div className="bg-gray-50 rounded-xl p-4">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Tamanho da Fonte
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {['pequeno', 'normal', 'grande'].map((size) => (
                        <button
                          key={size}
                          onClick={() => setFontSize(size)}
                          className={`
                            py-2 px-3 rounded-lg font-medium transition-all
                            ${fontSize === size 
                              ? 'bg-blue-600 text-white shadow-md' 
                              : 'bg-white text-gray-700 hover:bg-gray-100'
                            }
                          `}
                        >
                          <span className={
                            size === 'pequeno' ? 'text-xs' : 
                            size === 'grande' ? 'text-lg' : 'text-sm'
                          }>
                            {size === 'pequeno' ? 'Aa' : size === 'grande' ? 'Aa' : 'Aa'}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Alto Contraste */}
                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700">
                          Alto Contraste
                        </label>
                        <p className="text-xs text-gray-500 mt-0.5">
                          Melhor visibilidade para baixa visão
                        </p>
                      </div>
                      <button
                        onClick={() => setHighContrast(!highContrast)}
                        className={`
                          relative w-14 h-8 rounded-full transition-colors
                          ${highContrast ? 'bg-blue-600' : 'bg-gray-300'}
                        `}
                      >
                        <motion.div
                          animate={{ x: highContrast ? 24 : 2 }}
                          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                          className="absolute top-1 w-6 h-6 bg-white rounded-full shadow-md"
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </section>

              {/* Seção: Exportar */}
              <section>
                <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2 mb-3">
                  <Download className="w-5 h-5 text-blue-600" />
                  Exportar
                </h3>
                
                <button
                  onClick={exportToPDF}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl p-4 font-semibold hover:shadow-lg transition-shadow flex items-center justify-between"
                >
                  <span>Salvar Rotina em PDF</span>
                  <Download className="w-5 h-5" />
                </button>
              </section>

              {/* Seção: Sobre */}
              <section>
                <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2 mb-3">
                  <Info className="w-5 h-5 text-blue-600" />
                  Sobre o App
                </h3>
                
                <div className="bg-gradient-to-br from-blue-50 to-green-50 rounded-xl p-4 border-2 border-blue-100">
                  <p className="text-sm text-gray-700 leading-relaxed mb-3">
                    O <strong>Senior Gym AI</strong> usa inteligência artificial para criar rotinas de exercícios personalizadas e seguras para a terceira idade.
                  </p>
                  <p className="text-xs text-gray-600">
                    Versão 1.0.0 • Outubro 2025
                  </p>
                  <p className="text-xs text-gray-600 mt-2">
                    Desenvolvido com ❤️ para promover saúde e bem-estar
                  </p>
                </div>
              </section>

            </div>

            {/* Footer do Menu */}
            <div className="p-4 border-t border-gray-200 bg-gray-50">
              <p className="text-center text-xs text-gray-500">
                Senior Gym AI © 2025
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default SidebarMenu;