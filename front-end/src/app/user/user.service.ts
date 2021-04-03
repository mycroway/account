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
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer '+this.token })
  }
  
  constructor(private http: HttpClient) { }
  
  
  profile(): Observable<User> {
    return this.http.get<User>(this.baseUrl, this.httpOptions).pipe(
      map(obj => obj),
      catchError(e => this.errorHandler(e))
    )
  }
  
  update(user: User): Observable<User> {
    const newHeader = new HttpHeaders({Authorization: 'Bearer '+this.token});
    var saveUser = {
      name: user.name,
      gender: user.gender
    }
    return this.http.patch<User>(this.baseUrl, JSON.stringify(saveUser), this.httpOptions).pipe(
      map(obj => obj),
      catchError(e => this.errorHandler(e))
    )
  }
  
  delete(): Observable<any> {
    return this.http.delete(this.baseUrl, this.httpOptions).pipe(
      map(obj => obj),
      catchError(e => this.errorHandler(e))
    )
  }
  
  errorHandler(e: any): Observable<any> {
    alert('Houve um erro inesperado!')
    if (e.status >= 400 && e.status < 500) {
      this.storage.removeItem('token_login')
    }
    return EMPTY;
  }
}
