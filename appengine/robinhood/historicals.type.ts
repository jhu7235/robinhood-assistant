export interface IRobinhoodHistoricalsResponse {
  quote: string; // url
  symbol: string;
  interval: string; // '5minute' | '10minute'
  span: string; // 'day' | 'week'
  bounds: string; // 'regular'
  instrument: string; // url
  historicals: IHistoricalData[];
  InstrumentID: string;
}

export interface IHistoricalData {
  begins_at: string; // iso Date string
  open_price: string; // number
  close_price: string; // number
  high_price: string; // number
  low_price: string; // number
  volume: number;
  session: string; // 'reg'
  interpolated: boolean;
}

export type IInterval = '5minute' | '10minute';

export type ISpan = 'week' | 'day';
