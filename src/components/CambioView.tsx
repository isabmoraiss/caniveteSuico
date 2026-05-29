import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { RefreshCw, TrendingUp, AlertCircle } from 'lucide-react';

export default function CambioView() {
  const [cotacaoUsd, setCotacaoUsd] = useState<number>(5.06);
  const [cotacaoEur, setCotacaoEur] = useState<number>(5.52);
  const [timestamp, setTimestamp] = useState<string>('');
  const [inputValue, setInputValue] = useState<string>('');
  const [convertedValue, setConvertedValue] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [currencyType, setCurrencyType] = useState<'USD' | 'EUR'>('USD');
  const [errorMsg, setErrorMsg] = useState<string>('');

  useEffect(() => {
    fetchRates();
  }, []);

  const fetchRates = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      // Fetch via backend API to avoid local CORS issues
      const res = await fetch('/api/cambio');
      if (res.ok) {
        const data = await res.json();
        if (data.USD_BRL) {
          setCotacaoUsd(data.USD_BRL);
        }
        if (data.EUR_BRL) {
          setCotacaoEur(data.EUR_BRL);
        }
        if (data.timestamp) {
          setTimestamp(data.timestamp);
        }
      } else {
        // Direct fallback call directly to AwesomeAPI if backend is scaling or starting
        const altRes = await fetch('https://economia.awesomeapi.com.br/json/last/USD-BRL,EUR-BRL');
        if (altRes.ok) {
          const data = await altRes.json();
          if (data.USDBRL) {
            setCotacaoUsd(parseFloat(data.USDBRL.ask));
          }
          if (data.EURBRL) {
            setCotacaoEur(parseFloat(data.EURBRL.ask));
          }
          setTimestamp(new Date().toLocaleTimeString('pt-BR'));
        }
      }
    } catch (e) {
      console.warn('Erro ao carregar taxas de câmbio live. Usando valores estáticos do mockup.', e);
      // Fallback is already set in state
      setTimestamp('valores estáticos de demonstração');
    } finally {
      setLoading(false);
    }
  };

  const currentCotacao = currencyType === 'USD' ? cotacaoUsd : cotacaoEur;

  const handleConvert = (e: React.FormEvent) => {
    e.preventDefault();
    const value = parseFloat(inputValue.replace(',', '.'));
    if (isNaN(value) || value <= 0) {
      setConvertedValue(null);
      return;
    }
    setConvertedValue(value * currentCotacao);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="max-w-xl mx-auto bg-white rounded-2xl shadow-sm border border-neutral-100 p-8 my-6 space-y-6"
      id="cambio-view-container"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-neutral-100 pb-4 gap-2" id="cambio-header">
        <div>
          <h2 className="text-2xl font-bold text-neutral-800 tracking-tight" id="cambio-title">Conversor de Câmbio</h2>
          <p className="text-xs text-neutral-400 mt-1 font-mono">
            AwesomeAPI {timestamp ? `• Atualizado: ${timestamp}` : '(Carregando...)'}
          </p>
        </div>
        <div className="flex items-center gap-1.5 self-start sm:self-center">
          <button
            onClick={() => {
              setCurrencyType('USD');
              setConvertedValue(null);
            }}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
              currencyType === 'USD'
                ? 'bg-red-650 bg-red-600 text-white'
                : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-600'
            }`}
            id="btn-cambio-usd"
          >
            US Dollar (US$)
          </button>
          <button
            onClick={() => {
              setCurrencyType('EUR');
              setConvertedValue(null);
            }}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
              currencyType === 'EUR'
                ? 'bg-red-650 bg-red-600 text-white'
                : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-600'
            }`}
            id="btn-cambio-eur"
          >
            Euro (€)
          </button>
          <button
            onClick={fetchRates}
            title="Recarregar Cotações"
            className="p-1.5 rounded-lg border border-neutral-200 hover:bg-neutral-50 transition-colors text-neutral-500 cursor-pointer"
            id="btn-cambio-refresh"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      <div className="bg-neutral-50 rounded-xl p-4 flex items-center justify-between" id="cambio-rate-display">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-[#4CAF50]" />
          <span className="text-sm font-semibold text-neutral-600">
            Cotação Atual {currencyType === 'USD' ? 'USD' : 'EUR'}:
          </span>
        </div>
        <span className="text-xl font-black text-neutral-800" id="usd-cotacao-value">
          R$ {currentCotacao.toFixed(4).replace('.', ',')}
        </span>
      </div>

      <form onSubmit={handleConvert} className="space-y-4" id="cambio-form">
        <div>
          <label className="block text-sm font-medium text-neutral-600 mb-1" htmlFor="moneyInput">
            Valor em {currencyType === 'USD' ? 'US$' : '€'}
          </label>
          <input
            id="moneyInput"
            type="text"
            placeholder={currencyType === 'USD' ? 'Valor em US$' : 'Valor em €'}
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              setConvertedValue(null);
            }}
            className="w-full h-11 px-4 rounded-lg border border-neutral-200 bg-white shadow-inner text-neutral-800 placeholder-neutral-400 focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-colors"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-extrabold py-3.5 px-4 rounded-lg transition-colors cursor-pointer text-center uppercase tracking-wide text-sm"
          id="btn-converter-cambio"
        >
          Converter para R$
        </button>
      </form>

      {convertedValue !== null && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-5 bg-emerald-50 border border-emerald-200 rounded-xl text-center space-y-1"
          id="cambio-result"
        >
          <div className="text-xs font-semibold uppercase tracking-wider text-emerald-800 opacity-90">
            Valor Convertido
          </div>
          <div className="text-3xl font-black text-emerald-900">
            R$ {convertedValue.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="text-xxs font-mono text-emerald-600 mt-1">
            Calculado com base em 1 {currencyType} = R$ {currentCotacao.toFixed(4)}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
