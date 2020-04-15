import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { skipWhile, map } from 'rxjs/operators';
import { of } from 'rxjs';

interface IRobinhoodHistoricalsResponse {
  quote: string; // url
  symbol: string;
  interval: string; // '5minute' | '10minute'
  span: string; // 'day' | 'week'
  bounds: string; // 'regular'
  instrument: string; // url
  historicals: IHistoricalData[];
  InstrumentID: string;
}

export interface IHistoricalData {
  begins_at: string; // iso Date string
  open_price: string; // number
  close_price: string; // number
  high_price: string; // number
  low_price: string; // number
  volume: number;
  session: string; // 'reg'
  interpolated: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class HistoricalsClientService {
  private baseUrl = 'http://localhost:8080/historicals';

  constructor(private http: HttpClient) { }

  get(symbol: string, interval: string, span: string) {
    const response: IRobinhoodHistoricalsResponse = JSON.parse(window.localStorage.getItem(`historicals/${symbol}`));
    if (response) {
      return of(response);
    }
    return this.http.get<IRobinhoodHistoricalsResponse>(`${this.baseUrl}?symbol=${symbol}&span=${span}&interval=${interval}`)
      .pipe(map(historicalsResponse => {
        window.localStorage.setItem(`historicals/${symbol}`, JSON.stringify(historicalsResponse));
        return historicalsResponse;
      }), skipWhile(v => !v));
  }
}
