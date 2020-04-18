import alphavantage from 'alphavantage';
import fs from "fs";
import { IAlphaVantageDailyResponse } from './daily.types';

export type IOutputSize = 'full' | 'compact';

class AlphaAdvantageWrapper {
  // TODO: build out typing
  private alpha: any;
  private initPromise: Promise<any>;

  constructor() {
    this.alpha = alphavantage({ key: this.getApiKey() });
  }

  /**
   * Get daily data points for stock
   *
   * @param outputSize 'compact' for past 100 days, 'full' past 20 years
   */
  public async getDaily(symbol: string, outputSize: IOutputSize): Promise<IAlphaVantageDailyResponse> {
    const data = await this.alpha.data.daily(symbol, outputSize, 'json');
    return this.alpha.util.polish(data);
  }

  /**
   * Get daily data points for stock
   *
   * @param outputSize 'compact' for past 100 days, 'full' past 20 years
   */
  public async getIntraday(symbol: string, outputSize: IOutputSize): Promise<IAlphaVantageDailyResponse> {
    const data = await this.alpha.data.intraday(symbol, outputSize, 'json');
    return this.alpha.util.polish(data);
  }

  /**
   * Gets credentials from local file
   */
  private getApiKey(): string {
    const data = fs.readFileSync("credentials.json", "utf8");
    return JSON.parse(data).alphaAdvantageApiKey;
  }

}

export default new AlphaAdvantageWrapper();
