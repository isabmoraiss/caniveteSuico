import React, { useState } from 'react';
import { motion } from 'motion/react';
import { HelpCircle, CheckCircle2, AlertTriangle, Info } from 'lucide-react';

export default function ImcView() {
  const [pesoInput, setPesoInput] = useState<string>('');
  const [alturaInput, setAlturaInput] = useState<string>('');
  const [errorModel, setErrorModel] = useState<string>('');
  const [result, setResult] = useState<{ imc: number; classification: string } | null>(null);

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorModel('');
    setResult(null);

    const peso = parseFloat(pesoInput.replace(',', '.'));
    const altura = parseFloat(alturaInput.replace(',', '.'));

    if (isNaN(peso) || isNaN(altura)) {
      setErrorModel('Por favor, digite valores numéricos válidos.');
      return;
    }

    if (peso <= 0) {
      setErrorModel('O peso deve ser maior que zero (valores negativos ou zero não são aceitos).');
      return;
    }

    if (altura <= 0) {
      setErrorModel('A altura deve ser maior que zero (valores negativos ou zero não são aceitos).');
      return;
    }

    // Limit extreme inputs to make physical sense
    if (peso > 500) {
      setErrorModel('Peso excessivo inserido. Por favor, digite um valor menor de 500kg.');
      return;
    }
    if (altura > 3) {
      setErrorModel('Altura excessiva inserida. Por favor, digite em metros (ex: 1.75).');
      return;
    }

    const imc = peso / (altura * altura);
    let classification = '';

    if (imc < 18.5) {
      classification = 'Abaixo do peso';
    } else if (imc < 25) {
      classification = 'Peso normal';
    } else if (imc < 30) {
      classification = 'Sobrepeso';
    } else if (imc < 35) {
      classification = 'Obesidade Grau I';
    } else if (imc < 40) {
      classification = 'Obesidade Grau II';
    } else {
      classification = 'Obesidade Grau III (Mórbida)';
    }

    setResult({ imc, classification });
  };

  const getClassificationColor = (classification: string) => {
    if (classification === 'Peso normal') return 'text-emerald-600 bg-emerald-50 border-emerald-200';
    if (classification === 'Abaixo do peso') return 'text-amber-600 bg-amber-50 border-amber-200';
    return 'text-rose-600 bg-rose-50 border-rose-200';
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="max-w-md mx-auto bg-white rounded-2xl shadow-sm border border-neutral-100 p-8 my-6"
      id="imc-view-container"
    >
      <h2 className="text-2xl font-bold text-neutral-800 tracking-tight text-center mb-6" id="imc-title">
        Cálculo de IMC (Índice de Massa Corporal)
      </h2>

      <form onSubmit={handleCalculate} className="space-y-4" id="imc-form">
        <div>
          <label className="block text-sm font-medium text-neutral-600 mb-1" htmlFor="peso">
            Peso (kg)
          </label>
          <input
            id="peso"
            type="text"
            placeholder="Ex: 75.3"
            value={pesoInput}
            onChange={(e) => setPesoInput(e.target.value)}
            className="w-full h-11 px-4 rounded-lg border border-neutral-200 bg-white shadow-inner text-neutral-800 placeholder-neutral-400 focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-600 mb-1" htmlFor="altura">
            Altura (m)
          </label>
          <input
            id="altura"
            type="text"
            placeholder="Ex: 1.75"
            value={alturaInput}
            onChange={(e) => setAlturaInput(e.target.value)}
            className="w-full h-11 px-4 rounded-lg border border-neutral-200 bg-white shadow-inner text-neutral-800 placeholder-neutral-400 focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-colors"
          />
        </div>

        {errorModel && (
          <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm flex items-start gap-2 border border-red-100" id="imc-error">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errorModel}</span>
          </div>
        )}

        <button
          id="btn-calcular-imc"
          type="submit"
          className="w-full mt-2 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-bold py-3 px-4 rounded-lg transition-colors cursor-pointer text-center tracking-wide uppercase text-sm"
        >
          Calcular
        </button>
      </form>

      {result && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 border-t border-neutral-100 pt-6 space-y-4"
          id="imc-results-section"
        >
          <div className={`p-4 rounded-xl border flex flex-col items-center gap-1 text-center ${getClassificationColor(result.classification)}`} id="imc-results-badge">
            <span className="text-xs uppercase font-bold tracking-wider opacity-95">Seu Resultado</span>
            <span className="text-3xl font-black">{result.imc.toFixed(2)} kg/m²</span>
            <span className="font-semibold text-sm mt-1">{result.classification}</span>
          </div>

          <div className="bg-neutral-50 rounded-xl p-4 text-xs font-mono text-neutral-500 space-y-1.5" id="imc-classification-table">
            <div className="font-bold border-b border-neutral-200 pb-1 mb-1 text-neutral-600 text-center">Tabela de Referência</div>
            <div className="flex justify-between"><span>Abaixo de 18.5</span> <span>Abaixo do peso</span></div>
            <div className="flex justify-between"><span>18.5 a 24.9</span> <span>Peso normal</span></div>
            <div className="flex justify-between"><span>25.0 a 29.9</span> <span>Sobrepeso</span></div>
            <div className="flex justify-between"><span>30.0 a 34.9</span> <span>Obesidade Grau I</span></div>
            <div className="flex justify-between"><span>35.0 a 39.9</span> <span>Obesidade Grau II</span></div>
            <div className="flex justify-between"><span>Maior ou igual a 40</span> <span>Obesidade Grau III</span></div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
