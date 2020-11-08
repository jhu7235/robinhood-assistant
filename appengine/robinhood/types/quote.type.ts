
export interface IRobinhoodQuoteResponse {
  results: IRobinhoodQuote[];
}

export interface IRobinhoodQuote {
  ask_price: string; // number
  ask_size: number;
  bid_price: string; // number
  bid_size: number;
  last_trade_price: string; // number
  last_extended_hours_trade_price: string; // number
  previous_close: string; // number
  adjusted_previous_close: string; // number
  previous_close_date: string; // date yyyy-mm-dd
  symbol: string;
  trading_halted: boolean;
  has_traded: boolean;
  last_trade_price_source: string; // 'consolidated'
  updated_at: string; // isoDateString
  instrument: string; // url
}
