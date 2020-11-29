import fs from "fs";
import Robinhood, { RobinhoodWebApi } from "robinhood";
import { IAlphaVantageHistoricalResponse } from "../alpha-vantage/historical.types";
import { async } from "../helpers";
import { IRobinhoodAccountsResponse } from "./types/account.type";
import { ICredentials } from "./types/credentials.type";
import {
  IInterval,
  IRobinhoodHistoricalsResponse,
  ISpan,
} from "./types/historicals.type";
import { IRobinhoodInstrument } from "./types/instrument.type";
import { IRobinhoodOptionsOrdersResponse } from "./types/option.type";
import {
  IOrder,
  IOrderResponse,
  IRobinhoodOrdersResponse,
} from "./types/order.type";
import {
  IPosition,
  IPositionResponse,
  IRobinhoodPositionResponse,
} from "./types/positions.type";
import { IRobinhoodQuoteResponse } from "./types/quote.type";
import { IRobinhoodUser } from "./types/user.type";

const OPTIONS_ORDERS_URL = "https://api.robinhood.com/options/orders/";

/**
 * Wrapper around robinhood npm library
 */
class RobinhoodWrapper {
  private robinhood: RobinhoodWebApi;
  private initPromise: Promise<any>;
  // instrument cache
  private instruments: {
    [instrumentId: string]: Promise<IRobinhoodInstrument>;
  } = {};

  constructor() {
    this.sendCredentials();
  }

  /**
   * Get position with symbol
   */
  public async getPositions(): Promise<IPositionResponse> {
    await this.initPromise;
    const positionResponse: IRobinhoodPositionResponse = await this.httpGet(
      this.robinhood.positions
    );
    const promises = positionResponse.results.map(
      async (position): Promise<IPosition> => {
        const instrument = await this.getInstrument(position.instrument);
        return Object.assign({}, position, {
          symbol: instrument.symbol,
          simple_name: instrument.simple_name,
        });
      }
    );
    return Object.assign({}, positionResponse, {
      results: await Promise.all(promises),
    });
  }

  /**
   * Logs user into robinhood. Must happen before using library
   * returns logged in app and logged in data
   */
  public sendCredentials() {
    this.initPromise = new Promise((resolve) => {
      this.robinhood = Robinhood(this.getCredentials(), resolve);
    });
    this.initPromise
      .then(() => this.getUser())
      .then((user) => console.log("Robinhood: logged in:", user.email))
      .catch(() => {
        throw new Error("Login failed");
      });
  }

  public async getUser(): Promise<IRobinhoodUser> {
    await this.initPromise;
    return this.httpGet(this.robinhood.user);
  }

  public async getQuote(symbol: string): Promise<IRobinhoodQuoteResponse> {
    await this.initPromise;
    return this.httpGet(this.robinhood.quote_data, symbol);
  }

  public async getAccounts(): Promise<IRobinhoodAccountsResponse> {
    await this.initPromise;
    return this.httpGet(this.robinhood.accounts);
  }

  /**
   * Gets all the instruments for a user. Not used
   */
  public async getInstruments(): Promise<IRobinhoodInstrument[]> {
    await this.initPromise;
    await this.getOrders();
    return Promise.all(Object.values(this.instruments));
    // return this.httpGet(this.robinhood.instruments, null);
  }

  /**
   * Fetch instrument from Robinhood if it's not already in cache
   */
  public async getInstrument(
    instrumentId: string
  ): Promise<IRobinhoodInstrument> {
    await this.initPromise;
    // check cache first
    if (!this.instruments[instrumentId]) {
      this.instruments[instrumentId] = this.httpGet(
        this.robinhood.url,
        instrumentId
      ).then(async (instrument: IRobinhoodInstrument) => {
        instrument.fundamentals = await this.httpGet(
          this.robinhood.url,
          `${instrument.fundamentals}`
        );
        return instrument;
      });
      console.log(
        "fetching instrument",
        (await this.instruments[instrumentId]).symbol
      );
    } else {
      console.log(
        "instrument in cache already",
        (await this.instruments[instrumentId]).symbol
      );
    }
    return this.instruments[instrumentId];
  }

  /**
   * Recursively gets orders and adds symbol
   */
  public async getOrders(nextUrl?: string): Promise<IOrderResponse> {
    await this.initPromise;
    const ordersResponse: IRobinhoodOrdersResponse = nextUrl
      ? await this.httpGet(this.robinhood.url, nextUrl)
      : await this.httpGet(this.robinhood.orders, null);

    const promises = ordersResponse.results.map(
      async (order): Promise<IOrder> => {
        const instrument = await this.getInstrument(order.instrument);
        return Object.assign({}, order, {
          symbol: instrument.symbol,
          simple_name: instrument.simple_name,
        });
      }
    );
    const nextResults = ordersResponse.next
      ? (await this.getOrders(ordersResponse.next)).results
      : [];
    return Object.assign({}, ordersResponse, {
      results: [...(await Promise.all(promises)), ...nextResults],
    });
  }

  /**
   * Recursively gets options orders, and sends back a 
   * @param nextUrl curser url
   */
  public async getOptionsOrders(nextUrl?: string): Promise<IRobinhoodOptionsOrdersResponse> {
    await this.initPromise;
    const ordersResponse: IRobinhoodOptionsOrdersResponse = nextUrl
      ? await this.httpGet(this.robinhood.url, nextUrl)
      : await this.httpGet(this.robinhood.url, OPTIONS_ORDERS_URL);

    const nextResults =
      ordersResponse.next
        ? (await this.getOptionsOrders(ordersResponse.next)).results
        : [];

    ordersResponse.results = [...ordersResponse.results, ...nextResults];

    return ordersResponse;
  }

  public async getHistoricals(
    symbol: string,
    interval: IInterval,
    span: ISpan
  ): Promise<IAlphaVantageHistoricalResponse> {
    await this.initPromise;
    const response: IRobinhoodHistoricalsResponse = await this.httpGet(
      this.robinhood.historicals,
      symbol,
      interval,
      span
    );
    const fakeAVResponse: any = {
      data: {},
      meta: `robinhood daily response (${interval}, ${span})`,
    };
    response.historicals.forEach((historical) => {
      fakeAVResponse.data[historical.begins_at] = {
        close: historical.close_price,
        high: historical.high_price,
        low: historical.low_price,
        open: historical.open_price,
        volume: historical.volume,
      };
    });
    return fakeAVResponse as IAlphaVantageHistoricalResponse;
  }

  // TODO: move to ts decorator
  private async httpGet<T>(func, ...parameters): Promise<T> {
    const response = await async(func, ...parameters);
    // error are stored in details
    if (response.detail) {
      throw new Error(response.detail);
    }
    return response;
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
