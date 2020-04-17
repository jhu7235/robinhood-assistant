import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, skipWhile } from 'rxjs/operators';
import { of, Observable } from 'rxjs';


export interface IRobinhoodInstrument {
  id: string;
  url: string; // url
  quote: string; // url
  fundamentals: string; // url
  splits: string; // url
  state: string; // 'active' | 'inactive
  market: string; // url
  simple_name: string;
  name: string;
  tradeable: true;
  tradability: string; // 'tradable' | 'untradable'
  symbol: string;
  bloomberg_unique: string;
  margin_initial_ratio: string; // number
  maintenance_ratio: string; // number
  country: string;
  day_trade_ratio: string; // number
  list_date: string; // date yyyy-mm-dd
  min_tick_size: null;
  type: '';
  tradable_chain_id: null;
  rhs_tradability: string; // 'tradable' | 'untradable'
  fractional_tradability: string; // 'tradable' | 'untradable'
  default_collar_fraction: string; // number
}

@Injectable({
  providedIn: 'root'
})
export class InstrumentsClientService {
  // TODO: move this to environments
  private baseUrl = 'http://localhost:8080/instruments';

  constructor(private http: HttpClient) { }

  /**
   * Using IRobinhoodInstrument instead of IRobinhoodInstruments because it's been  modified to include instrument details
   */
  get(): Observable<IRobinhoodInstrument[]> {
    const response: IRobinhoodInstrument[] = JSON.parse(window.localStorage.getItem('instruments'));
    if (response) {
      return of(response);
    }
    return this.http.get<IRobinhoodInstrument[]>(this.baseUrl).pipe(map(instrumentsResponse => {
      window.localStorage.setItem('instruments', JSON.stringify(instrumentsResponse));
      return instrumentsResponse;
    }), skipWhile(v => !v));
  }
}
