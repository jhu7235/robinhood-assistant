import alphavantage from 'alphavantage';
import fs from "fs";
import { IAlphaVantageHistoricalResponse } from './historical.types';

export type IOutputSize = 'full' | 'compact';

export type IInterval = '1min' | '5min' | '15min' | '30min' | '60min';

class AlphaAdvantageWrapper {
  // TODO: build out typing
  private alpha: any;

  constructor() {
    this.alpha = alphavantage({ key: this.getApiKey() });
  }

  /**
   * Get daily data points for stock
   *
   * @param outputSize 'compact' for past 100 days, 'full' past 20 years
   */
  public async getDaily(symbol: string, outputSize: IOutputSize): Promise<IAlphaVantageHistoricalResponse> {
    const data = await this.alpha.data.daily_adjusted(symbol, outputSize, 'json');
    return this.polish(data);
  }

  /**
   * Get daily data points for stock
   *
   * @param outputSize 'compact' for past 100 days, 'full' past 20 years
   */
  public async getIntraday(
    symbol: string,
    outputSize: IOutputSize,
    interval: IInterval,
  ): Promise<IAlphaVantageHistoricalResponse> {
    const data = await this.alpha.data.intraday(symbol, outputSize, 'json', interval);
    return this.polish(data);
  }

  /**
   * Get daily data points for stock
   *
   * @param outputSize 'compact' for past 100 days, 'full' past 20 years
   */
  public async getWeekly(symbol: string, outputSize: IOutputSize): Promise<IAlphaVantageHistoricalResponse> {
    const data = await this.alpha.data.weekly(symbol, outputSize, 'json');
    return this.polish(data);
  }

  /**
   * Get daily data points for stock
   *
   * @param outputSize 'compact' for past 100 days, 'full' past 20 years
   */
  public async getMonthly(symbol: string, outputSize: IOutputSize): Promise<IAlphaVantageHistoricalResponse> {
    const data = await this.alpha.data.monthly(symbol, outputSize, 'json');
    return this.polish(data);
  }

  private polish(unPolishedResponse): IAlphaVantageHistoricalResponse {
    const response = this.alpha.util.polish(unPolishedResponse);
    for (const timestamp in response.data) {
      if (response.data.hasOwnProperty(timestamp)) {
        response.data[timestamp] = {
          adjusted: response.data[timestamp].volume
            ? Number(response.data[timestamp].volume)
            : undefined,
          close: Number(response.data[timestamp].close),
          high: Number(response.data[timestamp].high),
          low: Number(response.data[timestamp].low),
          open: Number(response.data[timestamp].open),
          volume: Number(response.data[timestamp].volume),
        };
      }
    }
    return response as IAlphaVantageHistoricalResponse;
  }

  /**
   * Gets credentials from local file
   */
  private getApiKey(): string {
    const data = fs.readFileSync("credentials.json", "utf8");
    const keyIndex = Math.floor(Math.random() * 9);
    console.log({ keyIndex });
    return JSON.parse(data).alphaAdvantageApiKeys[keyIndex];
  }
}

export default new AlphaAdvantageWrapper();
