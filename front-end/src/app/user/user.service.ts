import { Injectable } from '@angular/core';
import { User } from './user.model'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Observable, EMPTY } from "rxjs";
import { map, catchError } from "rxjs/operators";
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar} from '@angular/material/snack-bar'

interface Token  {
  token: string
}

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
  
  constructor(private snackBar: MatSnackBar, private http: HttpClient, private router: Router) { }
  
  
  showMessage(msg: string, isError: boolean = false): void {
    this.snackBar.open(msg, "", {
      duration: 5000,
      horizontalPosition: "right",
      verticalPosition: "top",
      panelClass: isError ? ["msg-error"] : ["msg-success"]
    });
  }
  
  
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
  
  auth(email: string, password: string): Observable<Token> {
    return this.http.post<Token>(this.baseUrl+'/auth', {email: email, password: password}).pipe(
      map(obj => obj),
      catchError(e => this.errorHandler(e))
    )
  }
  
  errorHandler(e: any): Observable<any> {
    this.showMessage(e.error.error, true)
    if (e.status == 401) {
      this.storage.removeItem('token_login')
      this.router.navigate(['/login'])
    }
    
    if (e.status == 404) {
      this.storage.removeItem('token_login')
      this.router.navigate(['/create'])
    }
    
    return EMPTY;
  }
}
