import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { skipWhile, map } from 'rxjs/operators';
import { of } from 'rxjs';
import { ONE_MINUTE, ONE_HOUR, ICachedResponse, ONE_WEEK, ONE_DAY } from './client-helper.functions';

interface IMeta {
  information: string;
  symbol: string;
  updated: string; // yyyy-mm-dd
  size: string;
  zone: string;
}

interface IHistorical {
  open: string; // number
  high: string; // number
  low: string; // number
  close: string; // number
  volume: string; // number
}

export type TInterval = 'daily' | 'intraday' | 'weekly' | 'monthly';

export interface IHistoricals {
  [timestamp: string]: IHistorical;
}

interface IHistoricalsResponse {
  meta: IMeta;
  data: IHistoricals;
}

@Injectable({
  providedIn: 'root'
})
export class HistoricalsClientService {
  // TODO: move this to environments
  private baseUrl = 'http://localhost:8080/historicals';

  constructor(private http: HttpClient) { }

  /**
   * Expire age should be about 1/4 of the interval. Except for intraday. That is immediate.
   */
  intervalToExpireAge(interval: TInterval) {
    switch (interval) {
      case 'intraday':
        return ONE_MINUTE;
      case 'daily':
        return 2 * ONE_HOUR;
      case 'weekly':
        return 2 * ONE_DAY;
      case 'monthly':
        return ONE_WEEK;
      default:
        throw new Error('cannot map interval to expire age');
    }
  }

  private intervalToParams(interval: TInterval) {
    if (interval === 'intraday') {
      // span is from robinhood api
      return { outputSize: 'full', interval: '5minute', span: 'day' };
    } else {
      return { outputSize: 'compact' };
    }

  }


  get(symbol: string, interval: TInterval) {
    const response: ICachedResponse<IHistoricalsResponse> = JSON.parse(window.localStorage.getItem(`historicals/${interval}/${symbol}`));
    if (response && (Date.now() - response.localCacheTime < this.intervalToExpireAge(interval))) {
      return of(response);
    }
    return this.http.get<IHistoricalsResponse>(`${this.baseUrl}/${interval}/${symbol}`, { params: this.intervalToParams(interval) })
      .pipe(map(historicalsResponse => {
        const cachedResponse: ICachedResponse<IHistoricalsResponse> = { ...historicalsResponse, localCacheTime: Date.now() };
        window.localStorage.setItem(`historicals/${interval}/${symbol}`, JSON.stringify(cachedResponse));
        return cachedResponse;
      }), skipWhile(v => !v));
  }
}
