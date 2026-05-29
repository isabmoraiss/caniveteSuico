import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shuffle, HelpCircle } from 'lucide-react';

export default function SorteadorView() {
  const [minStr, setMinStr] = useState<string>('');
  const [maxStr, setMaxStr] = useState<string>('');
  const [chosen, setChosen] = useState<number | null>(null);
  const [isRolling, setIsRolling] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  const handleDraw = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setChosen(null);

    const min = parseInt(minStr);
    const max = parseInt(maxStr);

    if (isNaN(min) || isNaN(max)) {
      setErrorMsg('Por favor, digite números inteiros válidos.');
      return;
    }

    if (min > max) {
      setErrorMsg('O número inicial não deve ser maior que o número final.');
      return;
    }

    setIsRolling(true);

    // Dynamic rolling effect simulation for visual flair!
    let count = 0;
    const interval = setInterval(() => {
      const tempNum = Math.floor(Math.random() * (max - min + 1)) + min;
      setChosen(tempNum);
      count++;
      if (count > 12) {
        clearInterval(interval);
        const finalNum = Math.floor(Math.random() * (max - min + 1)) + min;
        setChosen(finalNum);
        setIsRolling(false);
      }
    }, 60);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="max-w-md mx-auto bg-white rounded-2xl shadow-sm border border-neutral-100 p-8 my-6"
      id="sorteador-view-container"
    >
      <h2 className="text-2xl font-bold text-neutral-800 tracking-tight text-center mb-6" id="sorteador-title">
        Sorteador de Números
      </h2>

      <form onSubmit={handleDraw} className="space-y-4" id="sorteador-form">
        <div>
          <label className="block text-sm font-semibold text-neutral-600 mb-1" htmlFor="numInicial">
            Número Inicial:
          </label>
          <input
            id="numInicial"
            type="text"
            placeholder="Ex: 1"
            value={minStr}
            onChange={(e) => setMinStr(e.target.value)}
            className="w-full h-11 px-4 rounded-lg border border-neutral-200 bg-white shadow-inner text-neutral-800 placeholder-neutral-400 focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-neutral-600 mb-1" htmlFor="numFinal">
            Número Final:
          </label>
          <input
            id="numFinal"
            type="text"
            placeholder="Ex: 100"
            value={maxStr}
            onChange={(e) => setMaxStr(e.target.value)}
            className="w-full h-11 px-4 rounded-lg border border-neutral-200 bg-white shadow-inner text-neutral-800 placeholder-neutral-400 focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-colors"
          />
        </div>

        {errorMsg && (
          <div className="p-3 bg-red-50 text-red-600 rounded-lg text-xs font-medium border border-red-100" id="sorteador-error">
            {errorMsg}
          </div>
        )}

        <button
          type="submit"
          disabled={isRolling}
          className="w-full bg-red-600 hover:bg-red-700 active:bg-red-800 disabled:opacity-50 text-white font-extrabold py-3.5 px-4 rounded-lg transition-colors cursor-pointer text-center uppercase tracking-wide text-sm flex items-center justify-center gap-2"
          id="btn-sortear"
        >
          <Shuffle className={`w-4 h-4 ${isRolling ? 'animate-spin' : ''}`} />
          {isRolling ? 'Sorteando...' : 'Sortear!'}
        </button>
      </form>

      <AnimatePresence mode="wait">
        {chosen !== null && (
          <motion.div
            key={chosen}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="mt-8 pt-6 border-t border-neutral-100 flex flex-col items-center justify-center space-y-2"
            id="sorteador-results-section"
          >
            <div className="text-xs uppercase font-bold tracking-widest text-neutral-400">
              Número Sorteado
            </div>
            <div className={`text-6xl font-black font-mono transition-transform ${isRolling ? 'text-neutral-400 scale-95' : 'text-red-600 scale-110'}`} id="draw-result-number">
              {chosen}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
