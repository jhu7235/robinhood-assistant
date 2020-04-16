import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { skipWhile, map } from 'rxjs/operators';
import { of } from 'rxjs';

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

interface IAlphaVantageDailyResponse {
  meta: IMeta;
  data: IHistoricals;
}

@Injectable({
  providedIn: 'root'
})
export class HistoricalsClientService {
  private baseUrl = 'http://localhost:8080/historicals';

  constructor(private http: HttpClient) { }

  // get(symbol: string, interval: string, span: string) {
  get(symbol: string) {
    const response: IAlphaVantageDailyResponse = JSON.parse(window.localStorage.getItem(`historicals/${symbol}`));
    if (response) {
      return of(response);
    }
    return this.http.get<IAlphaVantageDailyResponse>(`${this.baseUrl}?symbol=${symbol}&outputSize=full`)
      .pipe(map(historicalsResponse => {
        window.localStorage.setItem(`historicals/${symbol}`, JSON.stringify(historicalsResponse));
        return historicalsResponse;
      }), skipWhile(v => !v));
  }
}
