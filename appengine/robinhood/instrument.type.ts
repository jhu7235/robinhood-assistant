export interface IRobinhoodInstrument {
  id: string;
  url: string; // url
  quote: string; // url
  fundamentals: string; // url
  splits: string; // url
  state: string; // 'active' | 'inactive
  market: string; // url
  simple_name: string;
  name: string;
  tradeable: true;
  tradability: string; // 'tradable' | 'untradable'
  symbol: string;
  bloomberg_unique: string;
  margin_initial_ratio: string; // number
  maintenance_ratio: string; // number
  country: string;
  day_trade_ratio: string; // number
  list_date: string; // date yyyy-mm-dd
  min_tick_size: null;
  type: '';
  tradable_chain_id: null;
  rhs_tradability: string; // 'tradable' | 'untradable'
  fractional_tradability: string; // 'tradable' | 'untradable'
  default_collar_fraction: string; // number
}
