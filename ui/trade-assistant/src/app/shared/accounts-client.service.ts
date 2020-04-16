import { Injectable } from '@angular/core';
import { of, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { skipWhile, map } from 'rxjs/operators';

interface IRobinhoodAccountsResponse {
  previous: string; // url
  results: IRobinhoodAccount[];
  next: string; // url
}

export interface IRobinhoodAccount {
  deactivated: boolean;
  updated_at: string; // iso timestamp
  margin_balances: { [str: string]: any };
  portfolio: string; // url
  cash_balances: null;
  withdrawal_halted: boolean;
  cash_available_for_withdrawal: string; // number
  type: string;
  sma: string; // number
  sweep_enabled: boolean;
  deposit_halted: boolean;
  buying_power: string; // number
  user: string; // url
  max_ach_early_access_amount: string; // number
  cash_held_for_orders: string; // number
  only_position_closing_trades: boolean;
  rl: string; // url
  positions: string; // url
  created_at: string; // iso timestamp
  cash: string; // number
  sma_held_for_orders: string; // number
  account_number: string; // number
  uncleared_deposits: string; // number
  unsettled_funds: string; // number
}

@Injectable({
  providedIn: 'root'
})
export class AccountsClientService {
  private baseUrl = 'http://localhost:8080/accounts';

  constructor(private http: HttpClient) { }

  get(): Observable<IRobinhoodAccount[]> {
    const response: IRobinhoodAccountsResponse = JSON.parse(window.localStorage.getItem('accounts'));
    if (response) {
      return of(response.results);
    }
    return this.http.get<IRobinhoodAccountsResponse>(this.baseUrl).pipe(map(userResponse => {
      window.localStorage.setItem('accounts', JSON.stringify(userResponse));
      return userResponse.results;
    }), skipWhile(v => !v));
  }
}
