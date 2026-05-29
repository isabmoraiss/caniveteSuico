import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { Landmark, ArrowUpRight, TrendingUp } from 'lucide-react';

interface ChartPoint {
  mes: number;
  "Montante Acumulado": number;
  "Juros Acumulados": number;
  "Capital Inicial": number;
}

export default function JurosView() {
  const [capitalStr, setCapitalStr] = useState<string>('1000');
  const [taxaStr, setTaxaStr] = useState<string>('1.5');
  const [mesesStr, setMesesStr] = useState<string>('12');
  const [chartData, setChartData] = useState<ChartPoint[] | null>(null);
  const [summary, setSummary] = useState<{
    capitalInicial: number;
    totalGanho: number;
    montanteFinal: number;
  } | null>(null);

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    const capital = parseFloat(capitalStr.replace(',', '.'));
    const taxa = parseFloat(taxaStr.replace(',', '.')) / 100; // convert % to decimal
    const meses = parseInt(mesesStr);

    if (isNaN(capital) || isNaN(taxa) || isNaN(meses) || capital <= 0 || taxa <= 0 || meses <= 0) {
      alert('Por favor, digite valores positivos válidos para todos os campos.');
      return;
    }

    if (meses > 120) {
      alert('Selecione um período de no máximo 120 meses para melhor visualização do gráfico.');
      return;
    }

    const dataPoints: ChartPoint[] = [];
    for (let m = 0; m <= meses; m++) {
      // Formula: M = P * (1 + i) ^ t
      const montante = capital * Math.pow(1 + taxa, m);
      const juros = montante - capital;
      dataPoints.push({
        mes: m,
        "Montante Acumulado": Math.round(montante * 100) / 100,
        "Juros Acumulados": Math.round(juros * 100) / 100,
        "Capital Inicial": capital,
      });
    }

    setChartData(dataPoints);
    setSummary({
      capitalInicial: capital,
      totalGanho: dataPoints[dataPoints.length - 1]["Juros Acumulados"],
      montanteFinal: dataPoints[dataPoints.length - 1]["Montante Acumulado"],
    });
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-neutral-200 rounded-lg shadow-md font-mono text-xs text-neutral-700">
          <p className="font-bold text-neutral-800 mb-1">Mês {data.mes}</p>
          <p className="text-neutral-500">Capital: R$ {data["Capital Inicial"].toFixed(2)}</p>
          <p className="text-emerald-600 font-semibold">Juros: R$ {data["Juros Acumulados"].toFixed(2)}</p>
          <p className="text-indigo-600 font-black border-t border-neutral-100 mt-1 pt-1">
            Total: R$ {data["Montante Acumulado"].toFixed(2)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-neutral-100 p-8 my-6 space-y-6"
      id="juros-view-container"
    >
      <div className="border-b border-neutral-100 pb-4" id="juros-header">
        <h2 className="text-2xl font-bold text-neutral-800 tracking-tight flex items-center gap-2" id="juros-title">
          <Landmark className="w-6 h-6 text-red-600" /> Calculadora de Juros Compostos
        </h2>
        <p className="text-sm text-neutral-400 mt-1 font-mono">
          Fórmula: M = P * (1 + i) ^ t
        </p>
      </div>

      <form onSubmit={handleCalculate} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end" id="juros-form">
        <div>
          <label className="block text-xs font-semibold text-neutral-600 mb-1 uppercase tracking-wider" htmlFor="valCapital">
            Capital (R$)
          </label>
          <input
            id="valCapital"
            type="text"
            placeholder="Ex: 5000"
            value={capitalStr}
            onChange={(e) => setCapitalStr(e.target.value)}
            className="w-full h-11 px-4 rounded-lg border border-neutral-200 bg-white shadow-inner text-neutral-800 placeholder-neutral-400 focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-colors"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-neutral-600 mb-1 uppercase tracking-wider" htmlFor="valTaxa">
            Taxa % (a.m.)
          </label>
          <input
            id="valTaxa"
            type="text"
            placeholder="Ex: 1.2"
            value={taxaStr}
            onChange={(e) => setTaxaStr(e.target.value)}
            className="w-full h-11 px-4 rounded-lg border border-neutral-200 bg-white shadow-inner text-neutral-800 placeholder-neutral-400 focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-colors"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-neutral-600 mb-1 uppercase tracking-wider" htmlFor="valMeses">
            Meses
          </label>
          <input
            id="valMeses"
            type="text"
            placeholder="Ex: 24"
            value={mesesStr}
            onChange={(e) => setMesesStr(e.target.value)}
            className="w-full h-11 px-4 rounded-lg border border-neutral-200 bg-white shadow-inner text-neutral-800 placeholder-neutral-400 focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-colors"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-extrabold h-11 rounded-lg transition-colors cursor-pointer text-center uppercase tracking-wide text-xs"
          id="btn-ver-grafico"
        >
          Ver Gráfico
        </button>
      </form>

      {summary && chartData && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6 pt-4 border-t border-neutral-100"
          id="juros-results-area"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4" id="juros-summary-cards">
            <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-100 text-center space-y-1">
              <div className="text-xxs font-semibold uppercase text-neutral-500 tracking-wider">Capital Inicial</div>
              <div className="text-xl font-bold text-neutral-700">
                R$ {summary.capitalInicial.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>

            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100 text-center space-y-1">
              <div className="text-xxs font-semibold uppercase text-emerald-700 tracking-wider flex items-center justify-center gap-1">
                Juros Acumulados <ArrowUpRight className="w-3 h-3" />
              </div>
              <div className="text-xl font-extrabold text-emerald-800">
                R$ {summary.totalGanho.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>

            <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-100 text-center space-y-1">
              <div className="text-xxs font-semibold uppercase text-indigo-700 tracking-wider flex items-center justify-center gap-1">
                Montante Acumulado <TrendingUp className="w-3 h-3" />
              </div>
              <div className="text-xl font-black text-indigo-950">
                R$ {summary.montanteFinal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>
          </div>

          <div className="bg-neutral-50 rounded-2xl p-4 border border-neutral-150" id="juros-chart-container">
            <h3 className="text-sm font-bold text-neutral-700 mb-4 px-2">Crescimento Patrimonial ao Longo do Tempo</h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorMontante" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#DC3545" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#DC3545" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E5E5"/>
                  <XAxis dataKey="mes" stroke="#A3A3A3" fontSize={11} tickLine={false} label={{ value: 'Mês', position: 'insideBottom', offset: -5 }} />
                  <YAxis stroke="#A3A3A3" fontSize={11} tickLine={false} tickFormatter={(val) => `R$${val}`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="Montante Acumulado"
                    stroke="#DC3545"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#colorMontante)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
