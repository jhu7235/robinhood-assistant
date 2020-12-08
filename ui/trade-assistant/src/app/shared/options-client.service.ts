import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, skipWhile } from 'rxjs/operators';
import { of, Observable } from 'rxjs';
import { FOUR_HOURS, ICachedResponse } from './client-helper.functions';

// NOTE: do not edit this. This is copied over from option.type.ts
interface IRobinhoodOptionsOrdersResponse {
  next: string;
  previous: string;
  detail: string;
  results: IRobinhoodOptionsOrder[];
}

interface IRobinhoodOptionLegs {
  executions: IOptionsExecution[];
  id: string;
  option: string; // url
  position_effect: 'close' | 'open';
  ratio_quantity: number;
  side: 'sell' | 'buy';
}

export interface IOptionsExecution   {
  id: string;
  price: string; // number
  quantity: string; // number
  settlement_date: string; // date string ("2020-11-05")
  timestamp: string; // date string ("2020-11-28T13:18:15.215197Z")
}

export interface IRobinhoodOptionsOrder {
  cancel_url: string; // url
  canceled_quantity: string; // number
  created_at: string; // date string ("2020-11-28T13:18:15.215197Z")
  direction: 'credit' | 'debit';
  id: 'string';
  legs: IRobinhoodOptionLegs[];
  pending_quantity: string; // number
  premium: string; // number
  processed_premium: string; // number
  price: string; // number
  processed_quantity: string; // number
  quantity: string; // number
  ref_id: string;
  state: 'queued' | 'confirmed' | 'cancelled' | 'filled' | 'rejected';
  time_in_force: 'gtc';
  trigger: 'immediate';
  type: 'limit' | 'market';
  updated_at: string; // date string ("2020-11-28T13:18:15.215197Z")
  chain_id: string;
  chain_symbol: string; // stock ticker symbol
  response_category: null;
  opening_strategy: null;
  closing_strategy: string; // TODO: update this ('long_call_spread')
  stop_price: string; // number
}




@Injectable({
  providedIn: 'root'
})
export class OptionsClientService {
  // TODO: move this to environments
  private baseUrl = 'http://localhost:8080/options/orders';

  constructor(private http: HttpClient) { }

  /**
   * Using IOptionsOrders instead of IRobinhoodOptionsOrders because it's been  modified to include instrument details
   */
  getOrders(): Observable<IRobinhoodOptionsOrder[]> {
    const response: ICachedResponse<IRobinhoodOptionsOrdersResponse> = JSON.parse(window.localStorage.getItem('optionsOrders'));
    if (response && (Date.now() - response.localCacheTime < FOUR_HOURS)) {
      return of(response.results);
    }
    return this.http.get<IRobinhoodOptionsOrdersResponse>(this.baseUrl).pipe(map(orderResponse => {
      const cachedResponse: ICachedResponse<IRobinhoodOptionsOrdersResponse> = { ...orderResponse, localCacheTime: Date.now() };
      window.localStorage.setItem('optionsOrders', JSON.stringify(cachedResponse));
      return orderResponse.results;
    }), skipWhile(v => !v));
  }
}
