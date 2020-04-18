import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { skipWhile, map } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { FOUR_HOURS, FIVE_MINUTES, ICachedResponse } from './client-helper.functions';

interface IRobinhoodQuoteResponse {
  results: IRobinhoodQuote[];
}

export interface IRobinhoodQuote {
  ask_price: string; // number
  ask_size: number;
  bid_price: string; // number
  bid_size: number;
  last_trade_price: string; // number
  last_extended_hours_trade_price: string; // number
  previous_close: string; // number
  adjusted_previous_close: string; // number
  previous_close_date: string; // date yyyy-mm-dd
  symbol: string;
  trading_halted: boolean;
  has_traded: boolean;
  last_trade_price_source: string; // 'consolidated'
  updated_at: string; // isoDateString
  instrument: string; // url
}

@Injectable({
  providedIn: 'root'
})
export class QuotesClientService {
  // TODO: move this to environments
  private baseUrl = 'http://localhost:8080/quote';

  constructor(private http: HttpClient) { }

  /**
   * Using IQuotes instead of IRobinhoodQuotes because it's been modified to
   * include instrument details.
   */
  get(symbol: string): Observable<IRobinhoodQuote[]> {
    const response: ICachedResponse<IRobinhoodQuoteResponse> = JSON.parse(window.localStorage.getItem(`quote/${symbol}`));
    if (response && (Date.now() - response.localCacheTime < FIVE_MINUTES)) {
      return of(response.results);
    }
    return this.http.get<IRobinhoodQuoteResponse>(`${this.baseUrl}/${symbol}`)
      .pipe(map(quoteResponse => {
        const cachedResponse: ICachedResponse<IRobinhoodQuoteResponse> = { ...quoteResponse, localCacheTime: Date.now() };
        window.localStorage.setItem(`quote/${symbol}`, JSON.stringify(cachedResponse));
        return quoteResponse.results;
      }), skipWhile(v => !v));
  }
}
