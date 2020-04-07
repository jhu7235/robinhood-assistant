import fs from "fs";
import Robinhood, { RobinhoodWebApi } from "robinhood";
import { async } from "../helpers";

interface IRobinhoodPositionResponse {
  next: string;
  previous: string;
  results: IRobinhoodPosition[];
}

interface IRobinhoodPosition {
  url: string;
  instrument: string; // url
  account: string;
  account_number: string;
  average_buy_price: string;
  pending_average_buy_price: string;
  quantity: string;
  intraday_average_buy_price: string;
  intraday_quantity: string;
  shares_held_for_buys: string;
  shares_held_for_sells: string;
  shares_held_for_stock_grants: string;
  shares_held_for_options_collateral: string;
  shares_held_for_options_events: string;
  shares_pending_from_options_events: string;
  updated_at: string; // timestamp
  created_at: string; // timestamp
}

interface IPosition extends IRobinhoodPosition {
  symbol: string;
}

interface IRobinhoodOrdersResponse {
  next: string;
  previous: string;
  results: IRobinhoodOrder[];
}

interface IOrderResponse {
  next: string;
  previous: string;
  results: IOrder[];
}

interface IRobinhoodExecution {
  price: string; // string number
  quantity: string; // string number
  settlement_date: string; // 2020-04-06
  timestamp: string; // iso date string
  id: string;
}
interface IExecution extends IRobinhoodExecution {
  symbol: string;
}

interface IRobinhoodOrder {
  id: string;
  ref_id: string;
  url: string;
  account: string;
  position: string;
  cancel: null;
  instrument: string;
  cumulative_quantity: string;
  average_price: string;
  fees: string;
  state: string;
  type: string;
  side: string;
  time_in_force: string;
  trigger: string;
  price: string;
  stop_price: null;
  quantity: string; // string number
  reject_reason: null;
  created_at: string; // iso date string
  updated_at: string; // iso date string
  last_transaction_at: string; // iso date string
  executions: IRobinhoodExecution[];
  extended_hours: boolean;
  override_dtbp_checks: boolean;
  override_day_trade_checks: boolean;
  response_category: null;
  stop_triggered_at: null;
  last_trail_price: null;
  last_trail_price_updated_at: null;
  total_notional: {
    amount: string; // number
    currency_code: string,
    currency_id: string;
  };
  executed_notional: {
    amount: string, // number
    currency_code: string,
    currency_id: string;
  };
  investment_schedule_id: null;
}

interface IOrder extends IRobinhoodOrder {
  symbol: string;
}

/**
 * Wrapper around robinhood npm library
 */
class RobinhoodWrapper {
  private robinhood: RobinhoodWebApi;
  private instrumentIdToSymbol: { [instrumentId: string]: Promise<string> } = {};

  constructor() {
    this.sendCredentials();
  }

  /**
   * Get position with symbol
   */
  public async getPositions() {
    const positionResponse: IRobinhoodPositionResponse = await async(this.robinhood.positions);
    const promises = positionResponse.results.map(async (position): Promise<IPosition> => {
      return Object.assign({}, position, { symbol: await this.getSymbol(position.instrument) });
    });
    return Object.assign({}, positionResponse, { results: await Promise.all(promises) });
  }

  /**
   * Logs user into robinhood. Must happen before using library
   * returns logged in app and logged in data
   */
  public async sendCredentials() {
    await new Promise((resolve) => {
      this.robinhood = Robinhood(this.getCredentials(), resolve);
    });
    return this.robinhood;
  }

  public next(url: string) {

  }

  public getUser() {
    return async(this.robinhood.user);
  }

  public getInstruments() {
    return async(this.robinhood.instruments, null);
  }

  /**
   * Gets symbol if not cached
   * TODO: cache the promise
   */
  public async getSymbol(instrumentId: string) {
    // check cache first
    if (this.instrumentIdToSymbol[instrumentId]) {
      console.log('symbol in cache already', this.instrumentIdToSymbol[instrumentId]);
      return this.instrumentIdToSymbol[instrumentId];
    }
    const instrument = await async(this.robinhood.url, instrumentId);
    this.instrumentIdToSymbol[instrumentId] = instrument.symbol;
    return instrument.symbol;
  }

  /**
   * Recursively gets orders and adds symbol
   */
  public async getOrders(nextUrl?: string): Promise<IOrderResponse> {
    const ordersResponse: IRobinhoodOrdersResponse = nextUrl
      ? await async(this.robinhood.url, nextUrl)
      : await async(this.robinhood.orders, null);

    const promises = ordersResponse.results.map(async (order): Promise<IOrder> => {
      return Object.assign({}, order, { symbol: await this.getSymbol(order.instrument) });
    });
    const nextResults = ordersResponse.next ? (await this.getOrders(ordersResponse.next)).results : [];
    return Object.assign({}, ordersResponse, { results: [...await Promise.all(promises), ...nextResults] });
  }

  /**
   * Gets credentials from local file
   */
  private getCredentials() {
    const data = fs.readFileSync("credentials.json", "utf8");
    return JSON.parse(data);
  }
}

export default new RobinhoodWrapper();
