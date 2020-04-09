import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { skipWhile, map } from 'rxjs/operators';

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
  private baseUrl = 'http://localhost:8080/user';

  constructor(private http: HttpClient) { }

  get(): Observable<IRobinhoodUser> {
    const response: IRobinhoodUser = JSON.parse(window.localStorage.getItem('user'));
    if (response) {
      return of(response);
    }
    return this.http.get<IRobinhoodUser>(this.baseUrl).pipe(map(userResponse => {
      window.localStorage.setItem('user', JSON.stringify(userResponse));
      return userResponse;
    }), skipWhile(v => !v));
  }
}
