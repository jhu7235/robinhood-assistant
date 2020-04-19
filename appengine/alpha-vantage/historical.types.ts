interface IMeta {
  information: string;
  symbol: string;
  updated: string; // yyyy-mm-dd
  size: string;
  zone: string;
}

interface IHistorical {
  open: string; // number
  high: string; // number
  low: string; // number
  close: string; // number
  volume: string; // number
}

export interface IHistoricals {
  [timestamp: string]: IHistorical;
}

export interface IAlphaVantageHistoricalResponse {
  meta: IMeta;
  data: IHistoricals;
}
