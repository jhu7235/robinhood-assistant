import { Injectable } from '@angular/core';
import { IHistoricalsResponse, IHistorical } from './historicals-client.service';


interface IOldHigh {
  date: number;
  value: number;
}

interface IData {
  timestamp: string;
  historical: IHistorical;
}

const TRADING_DAYS_PER_YEAR = 252;

@Injectable({
  providedIn: 'root'
})
export class BackTestService {

  /** account for splits */
  private accountForSplit(data: IData[]) {
    const historicals = data.map(({ timestamp, historical }) => {
      const splitFactor = historical.adjusted / historical.close;
      const newData: IData = {
        timestamp,
        historical: {
          ...historical,
          high: historical.high * splitFactor,
          low: historical.low * splitFactor,
          open: historical.open * splitFactor,
          close: historical.close * splitFactor,
        }
      };
      return newData;
    });
    return historicals;
  }

  private average(v1: number, v2: number) {
    return (v1 + v2) / 2;
  }

  private roundToHundredth(v) {
    return Math.round(v * 100) / 100;
  }

  /**
   * Assume it's initially reverse sorted
   */
  private getSortedData(historicalsResponse: IHistoricalsResponse): IData[] {
    return Object.entries(historicalsResponse.data).reverse()
      .map(([t, d]) => ({ timestamp: t, historical: d }));
  }

  private getMaxWithinSpan({ start, end }, historicals, oldHigh) {
    // if old high is within span, choose between new value and oldHigh
    if (
      oldHigh.date > new Date(historicals[start].timestamp).getTime()) {
      if (oldHigh.value > historicals[end].historical.high) {
        return oldHigh;
      }
      return {
        value: historicals[end].historical.high,
        date: new Date(historicals[end].timestamp).getTime(),
        buy: false
      };
    } else {
      oldHigh.value = -Infinity;
      for (let index = start; index <= end; index++) {
        const historical = historicals[index];
        if (historical.historical.high > oldHigh.value) {
          oldHigh = {
            value: historical.historical.high,
            date: new Date(historical.timestamp).getTime(),
          };
        }
      }
      return oldHigh;
    }
  }

  /**
   * Back test if we buy at a stock <priceChange> within <lookBackPeriod> window
   * @param lookBackPeriod in days
   * @param percentageChange in percent
   */
  public by3Month(historicalsResponse: IHistoricalsResponse, lookBackPeriod: number, percentageChange: number) {
    if (
      !historicalsResponse.meta.information ||
      !historicalsResponse.meta.information.toLocaleLowerCase().includes('daily')) {
      return null;
    }
    const lookBackDifference = lookBackPeriod - 1;
    console.log(`back testing ${historicalsResponse.meta.symbol}`);

    const transactions = [];

    const data = this.getSortedData(historicalsResponse);
    const historicals = this.accountForSplit(data);

    let cashIn = 0;
    let cashOut = 0;
    let shares = 0;
    let oldHigh: IOldHigh = { date: 0, value: -Infinity };
    for (let index = lookBackDifference; index < historicals.length; index++) {
      const today = historicals[index].historical;
      const timestamp = historicals[index].timestamp;
      oldHigh = this.getMaxWithinSpan({ start: index - lookBackDifference, end: index }, historicals, oldHigh);

      const change = today.low - oldHigh.value;
      const normalizedChange = change / oldHigh.value;

      if (normalizedChange < percentageChange) {
        const buyDailyAverage = this.roundToHundredth(this.average(today.open, today.close));
        cashIn += 100;
        shares += 100 / buyDailyAverage;
        oldHigh = {
          date: new Date(timestamp).getTime(),
          // sets the buy value as the oldHigh value
          value: buyDailyAverage,
        };

        const sell = historicals[index + TRADING_DAYS_PER_YEAR];
        let sellDailyAverage;
        if (sell) {
          sellDailyAverage = this.roundToHundredth(this.average(sell.historical.open, sell.historical.close));
          cashOut += (100 / buyDailyAverage) * sellDailyAverage;
        }

        transactions.push({
          symbol: historicalsResponse.meta.symbol,
          today,
          drop: `${-this.roundToHundredth(normalizedChange) * 100}% ($${-this.roundToHundredth(change)})`,
          buy: `$${buyDailyAverage} on ${timestamp}`,
          sell: sell ? `$${sellDailyAverage} on ${sell.timestamp}` : 'not sold yet',
          profit: sell ? `${
            this.roundToHundredth((sellDailyAverage - buyDailyAverage) / buyDailyAverage) * 100}%: ($${
            this.roundToHundredth(sellDailyAverage - buyDailyAverage)})` : 'not sold yet',
          cashIn,
          cashOut,
          shares,
          lossMoneyInOneYear: sellDailyAverage - buyDailyAverage < 0,
          equity: shares * sellDailyAverage
        });
      }
    }

    return transactions;

  }
}
