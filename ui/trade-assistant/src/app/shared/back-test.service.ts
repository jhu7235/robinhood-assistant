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
const INVESTMENT_INCREMENT = 500;

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

  private calcChange(oldHigh: number, currentLow: number) {
    const change = currentLow - oldHigh;
    const percent = change / oldHigh;
    return { value: change, percent };
  }

  /**
   * Back test if we buy at a stock <priceChange> within <lookBackPeriod> window
   * @param lookBackPeriod in days
   * @param percentageChange in fraction
   */
  public run(historicalsResponse: IHistoricalsResponse, lookBackPeriod: number, percentageChange: number) {
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
    let shares = 0;
    let oldHigh: IOldHigh = { date: 0, value: -Infinity };
    for (let index = lookBackDifference; index < historicals.length; index++) {

      const today = historicals[index];
      oldHigh = this.getMaxWithinSpan({ start: index - lookBackDifference, end: index }, historicals, oldHigh);
      const change = this.calcChange(oldHigh.value, today.historical.low);
      if (change.percent < percentageChange) {
        const dailyAverage = this.roundToHundredth(this.average(today.historical.open, today.historical.close));
        cashIn += INVESTMENT_INCREMENT;
        shares += INVESTMENT_INCREMENT / dailyAverage;
        oldHigh = {
          date: new Date(today.timestamp).getTime(),
          // sets the buy value as the oldHigh value
          value: dailyAverage,
        };

        const oneYearLater = historicals[index + TRADING_DAYS_PER_YEAR];
        let postOneYearDailyAverage;
        if (oneYearLater) {
          postOneYearDailyAverage = this.roundToHundredth(this.average(oneYearLater.historical.open, oneYearLater.historical.close));
        }

        transactions.push({
          today,
          trigger: {
            percent: change.percent * 100,
            value: change.value
          },
          cashIn,
          shares,
          equity: shares * dailyAverage,
          oneYearLater: {
            ...oneYearLater,
            change: {
              value: postOneYearDailyAverage - dailyAverage,
              percent: (postOneYearDailyAverage - dailyAverage) / dailyAverage * 100,
            },
            lossMoney: postOneYearDailyAverage - dailyAverage < 0,

          },
        });
      }
    }

    return transactions;

  }
}
