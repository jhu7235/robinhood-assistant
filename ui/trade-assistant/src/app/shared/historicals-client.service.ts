import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { skipWhile, map } from 'rxjs/operators';
import { of } from 'rxjs';
import { TWENTY_FOUR_HOURS, FOUR_HOURS, ICachedResponse } from './client-helper.functions';

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

  getDaily(symbol: string) {
    const response: ICachedResponse<IHistoricalsResponse> = JSON.parse(window.localStorage.getItem(`historicals/daily/${symbol}`));
    if (response && (Date.now() - response.localCacheTime < TWENTY_FOUR_HOURS)) {
      return of(response);
    }
    return this.http.get<IHistoricalsResponse>(`${this.baseUrl}/daily`, { params: { symbol, outputSize: 'full' } })
      .pipe(map(historicalsResponse => {
        const cachedResponse: ICachedResponse<IHistoricalsResponse> = { ...historicalsResponse, localCacheTime: Date.now() };
        window.localStorage.setItem(`historicals/daily/${symbol}`, JSON.stringify(cachedResponse));
        return historicalsResponse;
      }), skipWhile(v => !v));
  }

  getIntraDay(symbol: string) {
    const response: ICachedResponse<IHistoricalsResponse> = JSON.parse(window.localStorage.getItem(`historicals/intraday/${symbol}`));
    if (response && (Date.now() - response.localCacheTime < FOUR_HOURS)) {
      return of(response);
    }
    return this.http.get<IHistoricalsResponse>(`${this.baseUrl}/intraday`, { params: { symbol, outputSize: 'full' } })
      .pipe(map(historicalsResponse => {
        const cachedResponse: ICachedResponse<IHistoricalsResponse> = { ...historicalsResponse, localCacheTime: Date.now() };
        window.localStorage.setItem(`historicals/intraday/${symbol}`, JSON.stringify(cachedResponse));
        return historicalsResponse;
      }), skipWhile(v => !v));
  }
}
