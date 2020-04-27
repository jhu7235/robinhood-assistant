import { Injectable } from '@angular/core';
import { IHistoricals } from './historicals-client.service';
import { TWENTY_FOUR_HOURS } from './client-helper.functions';

interface ITimeInterval {
  start: number;
  stop: number;
}

interface IFinancialHistorical {
  h: number;
  l: number;
  o: number;
  c: number;
  t: number;
}

@Injectable({
  providedIn: 'root'
})
export class HistoricalDataService {

  constructor() { }

  public toCandleStick(
    historicalsMap: IHistoricals,
    timeInterval: ITimeInterval
  ) {
    const historicals: IFinancialHistorical[] = [];
    for (const timestamp in historicalsMap) {
      if (historicalsMap.hasOwnProperty(timestamp)) {
        const historical = historicalsMap[timestamp];
        const time = new Date(timestamp).getTime();
        if (this.isBetweenTimeInterval(time, timeInterval)) {
          historicals.push({
            h: historical.high,
            l: historical.low,
            o: historical.open,
            c: historical.close,
            t: time
          });
        }

      }
    }
    return historicals.sort((h1, h2) => h1.t - h2.t);
  }


  public toScatter(
    historicalsMap: IHistoricals,
    timeInterval: ITimeInterval
  ): Chart.ChartPoint[] {
    const now = Date.now();
    const data: Chart.ChartPoint[] = [];

    for (const timestamp in historicalsMap) {
      if (historicalsMap.hasOwnProperty(timestamp)) {
        const historical = historicalsMap[timestamp];
        const time = new Date(timestamp).getTime();
        if (this.isBetweenTimeInterval(time, timeInterval)) {
          data.push({
            x: (time - now) / TWENTY_FOUR_HOURS,
            y: Number(historical.close),
          } as Chart.ChartPoint);
        }
      }
    }
    return data;
  }

  private isBetweenTimeInterval(time: number, timeInterval: ITimeInterval) {
    return time > timeInterval.start && time < timeInterval.stop;
  }
}
