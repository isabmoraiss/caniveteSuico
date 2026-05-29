import React, { useState } from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, XCircle, FileText } from 'lucide-react';

export default function ValidadorView() {
  const [inputValue, setInputValue] = useState<string>('');
  const [validationResult, setValidationResult] = useState<{
    valid: boolean;
    tipo: 'CPF' | 'CNPJ' | 'Desconhecido';
    message: string;
    formatted: string;
  } | null>(null);

  const validarCPF = (cpf: string): boolean => {
    if (cpf.length !== 11) return false;
    if (/^(\d)\1{10}$/.test(cpf)) return false; // Reject repeated numbers (e.g., 11111111111)

    // Validate 1st digit
    let soma = 0;
    for (let i = 0; i < 9; i++) {
      soma += parseInt(cpf.charAt(i)) * (10 - i);
    }
    let resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.charAt(9))) return false;

    // Validate 2nd digit
    soma = 0;
    for (let i = 0; i < 10; i++) {
      soma += parseInt(cpf.charAt(i)) * (11 - i);
    }
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.charAt(10))) return false;

    return true;
  };

  const validarCNPJ = (cnpj: string): boolean => {
    if (cnpj.length !== 14) return false;
    if (/^(\d)\1{13}$/.test(cnpj)) return false; // Reject repeated numbers

    // Validate 1st digit
    let tamanho = cnpj.length - 2;
    let numeros = cnpj.substring(0, tamanho);
    let digitos = cnpj.substring(tamanho);
    let soma = 0;
    let pos = tamanho - 7;
    for (let i = tamanho; i >= 1; i--) {
      soma += parseInt(numeros.charAt(tamanho - i)) * pos--;
      if (pos < 2) pos = 9;
    }
    let resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
    if (resultado !== parseInt(digitos.charAt(0))) return false;

    // Validate 2nd digit
    tamanho = tamanho + 1;
    numeros = cnpj.substring(0, tamanho);
    soma = 0;
    pos = tamanho - 7;
    for (let i = tamanho; i >= 1; i--) {
      soma += parseInt(numeros.charAt(tamanho - i)) * pos--;
      if (pos < 2) pos = 9;
    }
    resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
    if (resultado !== parseInt(digitos.charAt(1))) return false;

    return true;
  };

  const cleanInput = (val: string) => {
    return val.replace(/\D/g, ''); // keep only numbers
  };

  const formatCPF = (digits: string) => {
    return digits.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  const formatCNPJ = (digits: string) => {
    return digits.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
  };

  const handleValidate = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanDigits = cleanInput(inputValue);

    if (!cleanDigits) {
      setValidationResult({
        valid: false,
        tipo: 'Desconhecido',
        message: 'Por favor, insira um documento numérico para validar.',
        formatted: '',
      });
      return;
    }

    if (cleanDigits.length === 11) {
      const isValid = validarCPF(cleanDigits);
      setValidationResult({
        valid: isValid,
        tipo: 'CPF',
        message: isValid
          ? 'O Cadastro de Pessoas Físicas (CPF) informado é VÁLIDO.'
          : 'O CPF informado possui dígitos verificadores INVÁLIDOS.',
        formatted: formatCPF(cleanDigits),
      });
    } else if (cleanDigits.length === 14) {
      const isValid = validarCNPJ(cleanDigits);
      setValidationResult({
        valid: isValid,
        tipo: 'CNPJ',
        message: isValid
          ? 'O Cadastro Nacional da Pessoa Jurídica (CNPJ) informado é VÁLIDO.'
          : 'O CNPJ informado possui dígitos verificadores INVÁLIDOS.',
        formatted: formatCNPJ(cleanDigits),
      });
    } else {
      setValidationResult({
        valid: false,
        tipo: 'Desconhecido',
        message: `Quantidade de dígitos inválida (${cleanDigits.length} dígitos). Um CPF deve conter 11 números, e um CNPJ deve conter 14.`,
        formatted: inputValue,
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="max-w-xl mx-auto bg-white rounded-2xl shadow-sm border border-neutral-100 p-8 my-6 space-y-6"
      id="validador-view-container"
    >
      <div className="border-b border-neutral-100 pb-4" id="validador-header">
        <h2 className="text-2xl font-bold text-neutral-800 tracking-tight flex items-center gap-2" id="validador-title">
          <FileText className="w-6 h-6 text-red-600" /> Validador de CPF e CNPJ
        </h2>
        <p className="text-xs text-neutral-400 mt-1 font-mono uppercase tracking-wider">
          Fórmula Oficial (Válido para CPF e CNPJ)
        </p>
      </div>

      <form onSubmit={handleValidate} className="space-y-4" id="validador-form">
        <div>
          <label className="block text-sm font-semibold text-neutral-600 mb-1" htmlFor="docInput">
            Documento (Apenas Números):
          </label>
          <input
            id="docInput"
            type="text"
            placeholder="Digite apenas os números"
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              setValidationResult(null);
            }}
            className="w-full h-11 px-4 rounded-lg border border-neutral-200 bg-white shadow-inner text-neutral-800 placeholder-neutral-400 focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-colors tracking-wide text-base"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-extrabold py-3 px-4 rounded-lg transition-colors cursor-pointer text-center uppercase tracking-wide text-sm"
          id="btn-verificar-validade"
        >
          Verificar Validade
        </button>
      </form>

      {validationResult && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-5 rounded-xl border flex gap-4 ${
            validationResult.valid
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
              : 'bg-rose-50 border-rose-200 text-rose-900'
          }`}
          id="validador-result-card"
        >
          <div className="mt-0.5 shrink-0">
            {validationResult.valid ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            ) : (
              <XCircle className="w-5 h-5 text-rose-600" />
            )}
          </div>
          <div className="space-y-1">
            <div className="text-xs uppercase font-bold tracking-widest text-neutral-400">
              {validationResult.tipo !== 'Desconhecido' && `${validationResult.tipo} • `}
              {validationResult.valid ? 'VÁLIDO' : 'INVÁLIDO'}
            </div>
            {validationResult.formatted && (
              <div className="text-lg font-black tracking-wider leading-none">
                {validationResult.formatted}
              </div>
            )}
            <div className="text-sm opacity-90">{validationResult.message}</div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
