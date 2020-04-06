import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class OrdersClientService {
  private baseUrl = 'http://localhost:8080/orders';

  constructor(private http: HttpClient) { }

  get(){
    return this.http.get(this.baseUrl).toPromise();
  }
}
