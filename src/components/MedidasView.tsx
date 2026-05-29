import React, { useState } from 'react';
import { motion } from 'motion/react';

type UnitConversionType = 'POL_CM' | 'FAHR_CELS' | 'GAL_LIT' | 'LIB_KG';

export default function MedidasView() {
  const [inputValue, setInputValue] = useState<string>('85');
  const [activeType, setActiveType] = useState<UnitConversionType>('FAHR_CELS');
  const [result, setResult] = useState<string>('29,44 °C');

  const performConversion = (valStr: string, type: UnitConversionType) => {
    const val = parseFloat(valStr.replace(',', '.'));
    if (isNaN(val)) {
      setResult('Por favor, digite um número válido.');
      return;
    }

    let convertedValue = 0;
    let unit = '';

    switch (type) {
      case 'POL_CM':
        convertedValue = val * 2.54;
        unit = 'cm';
        break;
      case 'FAHR_CELS':
        convertedValue = ((val - 32) * 5) / 9;
        unit = '°C';
        break;
      case 'GAL_LIT':
        convertedValue = val * 3.78541;
        unit = 'litros';
        break;
      case 'LIB_KG':
        convertedValue = val * 0.45359237;
        unit = 'kg';
        break;
    }

    const formatted = convertedValue.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    setResult(`Resultado: ${formatted} ${unit}`);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value;
    setInputValue(rawVal);
    performConversion(rawVal, activeType);
  };

  const handleTypeSelect = (type: UnitConversionType) => {
    setActiveType(type);
    performConversion(inputValue, type);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="max-w-xl mx-auto bg-white rounded-2xl shadow-sm border border-neutral-100 p-8 my-6"
      id="medidas-view-container"
    >
      <div className="border-b border-neutral-100 pb-4 mb-6" id="medidas-header">
        <h2 className="text-2xl font-bold text-neutral-800 tracking-tight" id="medidas-title">
          Conversor de Medidas
        </h2>
        <p className="text-sm text-neutral-400 mt-1" id="medidas-subtitle">
          Converta facilmente polegadas, temperatura, volumes e pesos no padrão internacional.
        </p>
      </div>

      <div className="space-y-6" id="medidas-body">
        <div>
          <label className="block text-sm font-bold text-neutral-700 mb-2" htmlFor="valToConvert">
            Valor para converter:
          </label>
          <input
            id="valToConvert"
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            placeholder="Digite o valor..."
            className="w-full h-11 px-4 rounded-lg border border-neutral-200 bg-white shadow-inner text-neutral-800 placeholder-neutral-400 focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-colors text-base"
          />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2" id="medidas-button-group">
          <button
            onClick={() => handleTypeSelect('POL_CM')}
            className={`py-3 px-2 rounded-lg border text-xs font-black text-center uppercase tracking-wider transition-colors cursor-pointer ${
              activeType === 'POL_CM'
                ? 'bg-red-600 text-white border-red-700 shadow-sm'
                : 'bg-neutral-50 hover:bg-neutral-100 text-neutral-700 border-neutral-200'
            }`}
            id="btn-medidas-pol-cm"
          >
            POL &gt;&gt; CM
          </button>

          <button
            onClick={() => handleTypeSelect('FAHR_CELS')}
            className={`py-3 px-2 rounded-lg border text-xs font-black text-center uppercase tracking-wider transition-colors cursor-pointer ${
              activeType === 'FAHR_CELS'
                ? 'bg-red-600 text-white border-red-700 shadow-sm'
                : 'bg-neutral-50 hover:bg-neutral-100 text-neutral-700 border-neutral-200'
            }`}
            id="btn-medidas-fahr-cels"
          >
            FAHR &gt;&gt; CELS
          </button>

          <button
            onClick={() => handleTypeSelect('GAL_LIT')}
            className={`py-3 px-2 rounded-lg border text-xs font-black text-center uppercase tracking-wider transition-colors cursor-pointer ${
              activeType === 'GAL_LIT'
                ? 'bg-red-600 text-white border-red-700 shadow-sm'
                : 'bg-neutral-50 hover:bg-neutral-100 text-neutral-700 border-neutral-200'
            }`}
            id="btn-medidas-gal-lit"
          >
            GALÕES &gt;&gt; LITROS
          </button>

          <button
            onClick={() => handleTypeSelect('LIB_KG')}
            className={`py-3 px-2 rounded-lg border text-xs font-black text-center uppercase tracking-wider transition-colors cursor-pointer ${
              activeType === 'LIB_KG'
                ? 'bg-red-600 text-white border-red-700 shadow-sm'
                : 'bg-neutral-50 hover:bg-neutral-100 text-neutral-700 border-neutral-200'
            }`}
            id="btn-medidas-lib-kg"
          >
            LIBRAS &gt;&gt; KG
          </button>
        </div>

        {result && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-[#DFF0D8] border border-[#D6E9C6] rounded-lg text-left"
            id="medidas-conversion-badge"
          >
            <span className="text-base font-medium text-[#3C763D]">{result}</span>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
