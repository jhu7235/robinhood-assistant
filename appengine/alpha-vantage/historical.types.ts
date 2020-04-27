interface IMeta {
  information: string;
  symbol: string;
  updated: string; // yyyy-mm-dd
  size: string;
  zone: string;
}

interface IHistorical {
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  adjusted?: number;
}

export interface IHistoricals {
  [timestamp: string]: IHistorical;
}

export interface IAlphaVantageHistoricalResponse {
  meta: IMeta;
  data: IHistoricals;
}
