import fs from "fs";
import Robinhood, { RobinhoodWebApi } from "robinhood";
import { async } from "../helpers";
import { IRobinhoodAccountsResponse } from "./account.type";
import { IRobinhoodHistoricalsResponse } from "./historicals.type";
import { IRobinhoodInstrument } from "./instrument.type";
import { IOrder, IOrderResponse, IRobinhoodOrdersResponse } from "./order.type";
import { IPosition, IPositionResponse, IRobinhoodPositionResponse } from "./positions.type";
import { IRobinhoodQuoteResponse } from "./quote.type";
import { IRobinhoodUser } from "./user.type";

/**
 * Wrapper around robinhood npm library
 */
class RobinhoodWrapper {
  private robinhood: RobinhoodWebApi;
  // instrument cache
  private instruments: { [instrumentId: string]: Promise<IRobinhoodInstrument> } = {};

  constructor() {
    this.sendCredentials();
  }

  /**
   * Get position with symbol
   */
  public async getPositions(): Promise<IPositionResponse> {
    const positionResponse: IRobinhoodPositionResponse = await async(this.robinhood.positions);
    const promises = positionResponse.results.map(async (position): Promise<IPosition> => {
      const instrument = await this.getInstrument(position.instrument);
      return Object.assign({}, position, { symbol: instrument.symbol, name: instrument.simple_name });
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

  public getUser(): Promise<IRobinhoodUser> {
    return async(this.robinhood.user);
  }

  public getQuote(symbol: string): Promise<IRobinhoodQuoteResponse> {
    return async(this.robinhood.quote_data, symbol);
  }

  public getAccounts(): Promise<IRobinhoodAccountsResponse> {
    return async(this.robinhood.accounts);
  }

  /**
   * Gets all the instruments for a user. Not used
   */
  public async getInstruments(): Promise<IRobinhoodInstrument[]> {
    await this.getOrders();
    return Promise.all(Object.values(this.instruments));
    // return async(this.robinhood.instruments, null);
  }

  /**
   * Fetch instrument from Robinhood if it's not already in cache
   */
  public async getInstrument(instrumentId: string): Promise<IRobinhoodInstrument> {
    // check cache first
    if (!this.instruments[instrumentId]) {
      this.instruments[instrumentId] = async(this.robinhood.url, instrumentId)
        .then(async (instrument: IRobinhoodInstrument) => {
          instrument.fundamentals = await async(this.robinhood.url, `${instrument.fundamentals}/${instrument.symbol}`);
          return instrument;
        });
      console.log('fetching instrument', (await this.instruments[instrumentId]).symbol);
    } else {
      console.log('instrument in cache already', (await this.instruments[instrumentId]).symbol);
    }
    return this.instruments[instrumentId];
  }

  /**
   * Recursively gets orders and adds symbol
   */
  public async getOrders(nextUrl?: string): Promise<IOrderResponse> {
    const ordersResponse: IRobinhoodOrdersResponse = nextUrl
      ? await async(this.robinhood.url, nextUrl)
      : await async(this.robinhood.orders, null);

    const promises = ordersResponse.results.map(async (order): Promise<IOrder> => {
      const instrument = await this.getInstrument(order.instrument);
      return Object.assign({}, order, { symbol: instrument.symbol, name: instrument.simple_name });
    });
    const nextResults = ordersResponse.next ? (await this.getOrders(ordersResponse.next)).results : [];
    return Object.assign({}, ordersResponse, { results: [...await Promise.all(promises), ...nextResults] });
  }

  public getHistoricals(symbol: string, interval: string, span: string): Promise<IRobinhoodHistoricalsResponse> {
    return async(this.robinhood.historicals, symbol, interval, span);
  }

  /**
   * Gets credentials from local file
   */
  private getCredentials(): ICredentials {
    const data = fs.readFileSync("credentials.json", "utf8");
    return JSON.parse(data);
  }
}

/**
 * Return instantiated for now. Should use nextjs
 */
export default new RobinhoodWrapper();
