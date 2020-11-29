export interface IRobinhoodOptionsOrdersResponse {
  next: string;
  previous: string;
  detail: string;
  results: IRobinhoodOptionsOrder[];
}

interface IRobinhoodOptionLegs {
  executions: any[];
  id: string;
  option: string; // url
  position_effect: "close" | "open";
  ratio_quantity: number;
  side: "sell" | "buy";
}

interface IRobinhoodOptionsOrder {
  cancel_url: string; // url
  canceled_quantity: string; // number
  created_at: string; // date string ("2020-11-28T13:18:15.215197Z")
  direction: "credit" | "debit";
  id: "3dd1e049-43f0-4f41-9b35-622665d1f0c9";
  legs: IRobinhoodOptionLegs[];
  pending_quantity: string; // number
  premium: string; // number
  processed_premium: string; // number
  price: string; // number
  processed_quantity: string; // number
  quantity: string; // number
  ref_id: string;
  state: "queued" | "confirmed" | "cancelled" | "filled" | "rejected";
  time_in_force: "gtc";
  trigger: "immediate";
  type: "limit" | "market";
  updated_at: string; // date string ("2020-11-28T13:18:15.215197Z")
  chain_id: string;
  chain_symbol: string; // stock ticker symbol
  response_category: null;
  opening_strategy: null;
  closing_strategy: "long_call_spread"; // TODO: update this
  stop_price: string; // number
}
