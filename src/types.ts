export type ViewType = 'inicio' | 'imc' | 'cambio' | 'medidas' | 'juros' | 'sorteador' | 'validador';

export interface ImcData {
  peso: number;
  altura: number;
}

export interface ImcResult {
  imcValue: number;
  classification: string;
}

export interface ExchangeRates {
  USD_BRL: number;
  EUR_BRL: number;
  timestamp: string;
}

export interface InterestInputs {
  capital: number;
  taxa: number; // monthly interest rate in percentage
  meses: number;
}

export interface InterestDataPoint {
  mes: number;
  capitalInicial: number;
  rendimento: number;
  totalAcumulado: number;
}

export interface SorteadorInputs {
  numeroInicial: number;
  numeroFinal: number;
}
