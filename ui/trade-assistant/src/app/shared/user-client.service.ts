import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { skipWhile, map } from 'rxjs/operators';
import { FOUR_HOURS, ICachedResponse } from './client-helper.functions';

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


@Injectable({
  providedIn: 'root'
})
export class UserClientService {
  // TODO: move this to environments
  private baseUrl = 'http://localhost:8080/user';

  constructor(private http: HttpClient) { }

  get(): Observable<ICachedResponse<IRobinhoodUser>> {
    const response: ICachedResponse<IRobinhoodUser> = JSON.parse(window.localStorage.getItem('user'));
    if (response && (Date.now() - response.localCacheTime < FOUR_HOURS)) {
      return of(response);
    }
    return this.http.get<IRobinhoodUser>(this.baseUrl).pipe(map(userResponse => {
      const cachedResponse: ICachedResponse<IRobinhoodUser> = { ...userResponse, localCacheTime: Date.now() };
      window.localStorage.setItem('user', JSON.stringify(cachedResponse));
      return cachedResponse;
    }), skipWhile(v => !v));
  }
}
