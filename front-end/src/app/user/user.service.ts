import { Injectable } from '@angular/core';
import { User } from './user.model'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Observable, EMPTY } from "rxjs";
import { map, catchError } from "rxjs/operators";


@Injectable({
  providedIn: 'root'
})
export class UserService {
  
  storage = window.localStorage
  baseUrl = 'http://localhost:3000'
  token = this.storage.getItem('token_login')
  
  constructor(private http: HttpClient) { }
  
  
  profile(): Observable<User> {
    const newHeader = new HttpHeaders({Authorization: 'Bearer '+this.token});
    return this.http.get<User>(this.baseUrl, {headers: newHeader}).pipe(
      map(obj => obj),
      catchError(e => this.errorHandler(e))
    )
  }
  
  errorHandler(e: any): Observable<any> {
    alert('Houve um erro inesperado!')
    return EMPTY;
  }
}
