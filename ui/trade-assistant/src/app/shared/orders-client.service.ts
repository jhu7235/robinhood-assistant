import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, skipWhile } from 'rxjs/operators';
import { of } from 'rxjs';


interface IRobinhoodOrderResponse {
  next: string;
  previous: string;
  // modified in the backend
  results: IOrder[];
}

export interface IRobinhoodExecution {
  price: string; // string number
  quantity: string; // string number
  settlement_date: string; // 2020-04-06
  timestamp: string; // iso date string
  id: string;
}

export interface IExecution extends IRobinhoodExecution {
  symbol: string;
  side: string;
}

interface IRobinhoodOrder {
  id: string;
  ref_id: string;
  url: string;
  account: string;
  position: string;
  cancel: null;
  instrument: string;
  cumulative_quantity: string;
  average_price: string;
  fees: string;
  state: string;
  type: string;
  side: string;
  time_in_force: string;
  trigger: string;
  price: string;
  stop_price: null;
  quantity: string; // string number
  reject_reason: null;
  created_at: string; // iso date string
  updated_at: string; // iso date string
  last_transaction_at: string; // iso date string
  executions: IRobinhoodExecution[];
  extended_hours: boolean;
  override_dtbp_checks: boolean;
  override_day_trade_checks: boolean;
  response_category: null;
  stop_triggered_at: null;
  last_trail_price: null;
  last_trail_price_updated_at: null;
  total_notional: {
    amount: string; // number
    currency_code: string,
    currency_id: string;
  };
  executed_notional: {
    amount: string, // number
    currency_code: string,
    currency_id: string;
  };
  investment_schedule_id: null;
}

export interface IOrder extends IRobinhoodOrder {
  symbol: string;
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class OrdersClientService {
  private baseUrl = 'http://localhost:8080/orders';

  constructor(private http: HttpClient) { }

  get() {
    const response = JSON.parse(window.localStorage.getItem('orders'));
    if (response) {
      return of(response.results);
    }
    return this.http.get<IRobinhoodOrderResponse>(this.baseUrl).pipe(map(orderResponse => {
      window.localStorage.setItem('orders', JSON.stringify(orderResponse));
      return orderResponse.results;
    }), skipWhile(v => !v));
  }
}
