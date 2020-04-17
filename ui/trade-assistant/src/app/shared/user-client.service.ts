import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { skipWhile, map } from 'rxjs/operators';
import { FOUR_HOURS } from './client-helper.functions';

interface IRobinhoodUser {
  url: string; // url
  id: string;
  id_info: string; // url
  username: string; // email
  email: string; // email
  email_verified: boolean;
  first_name: string;
  last_name: string;
  origin: {
    locality: string
  };
  profile_name: string;
  created_at: string; // timestamp
}

// TODO: this is used in multiple places, figure out how to dynamically extend
// the interface
interface ICachedResponse extends IRobinhoodUser {
  localCacheTime: number; // timestamp
}

@Injectable({
  providedIn: 'root'
})
export class UserClientService {
  private baseUrl = 'http://localhost:8080/user';

  constructor(private http: HttpClient) { }

  get(): Observable<ICachedResponse> {
    const response: ICachedResponse = JSON.parse(window.localStorage.getItem('user'));
    if (response && (Date.now() - response.localCacheTime < FOUR_HOURS)) {
      return of(response);
    }
    return this.http.get<ICachedResponse>(this.baseUrl).pipe(map(userResponse => {
      const cachedResponse: ICachedResponse = { ...userResponse, localCacheTime: Date.now() };
      window.localStorage.setItem('user', JSON.stringify(cachedResponse));
      return userResponse;
    }), skipWhile(v => !v));
  }
}
