import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { skipWhile, map } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

interface IRobinhoodQuoteResponse {
  results: IRobinhoodQuote;
}

export interface IRobinhoodQuote {
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


export interface IQuote extends IRobinhoodQuote {
  symbol: string;
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class QuotesClientService {
  // move this to environments
  private baseUrl = 'http://localhost:8080/quote';

  constructor(private http: HttpClient) { }

  /**
   * Using IQuotes instead of IRobinhoodQuotes because it's been  modified to include instrument details
   */
  get(symbol: string): Observable<IRobinhoodQuote> {
    const response: IRobinhoodQuoteResponse = JSON.parse(window.localStorage.getItem('quote'));
    if (response) {
      return of(response.results);
    }
    return this.http.get<IRobinhoodQuoteResponse>(`${this.baseUrl}/${symbol}`)
      .pipe(map(quoteResponse => {
        window.localStorage.setItem('quote', JSON.stringify(quoteResponse));
        return quoteResponse.results;
      }), skipWhile(v => !v));
  }
}
