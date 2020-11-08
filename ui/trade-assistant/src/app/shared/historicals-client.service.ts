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

export interface IHistorical {
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  adjusted?: number;
}

export type IInterval = 'daily' | 'intraday' | 'weekly' | 'monthly';

export interface IHistoricals {
  [timestamp: string]: IHistorical;
}

export interface IHistoricalsResponse {
  meta: IMeta;
  data: IHistoricals;
  localCacheTime: number;
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
  intervalToExpireAge(interval: IInterval) {
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

  private intervalToParams(interval: IInterval) {
    if (interval === 'intraday') {
      // span is from robinhood api
      return { outputSize: 'full', interval: '5minute', span: 'day' };
    } else if (interval === 'daily') {
      return { outputSize: 'full' };
    } else {
      return { outputSize: 'compact' };
    }
  }


  get(symbol: string, interval: IInterval) {
    const response: ICachedResponse<IHistoricalsResponse> = JSON.parse(window.localStorage.getItem(`historicals/${interval}/${symbol}`));
    if (
      response
      && response.data
      && (Date.now() - response.localCacheTime < this.intervalToExpireAge(interval))
      // && response.meta.symbol !== 'NFLX'
    ) {
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
