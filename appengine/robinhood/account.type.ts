export interface IRobinhoodAccountsResponse {
  previous: string; // url
  results: IRobinhoodAccount[];
  next: string; // url
}

interface IRobinhoodAccount {
  deactivated: boolean;
  updated_at: string; // iso timestamp
  margin_balances: { [str: string]: any };
  portfolio: string; // url
  cash_balances: null;
  withdrawal_halted: boolean;
  cash_available_for_withdrawal: string; // number
  type: string;
  sma: string; // number
  sweep_enabled: boolean;
  deposit_halted: boolean;
  buying_power: string; // number
  user: string; // url
  max_ach_early_access_amount: string; // number
  cash_held_for_orders: string; // number
  only_position_closing_trades: boolean;
  rl: string; // url
  positions: string; // url
  created_at: string; // iso timestamp
  cash: string; // number
  sma_held_for_orders: string; // number
  account_number: string; // number
  uncleared_deposits: string; // number
  unsettled_funds: string; // number
}
