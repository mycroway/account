import { Component, OnInit } from '@angular/core';
import { User } from './../../user/user.model'
import { UserService } from './../../user/user.service'
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  
  storage = window.localStorage
  
  user: User = {
    name: '',
    email: '',
    gender: '',
    role: '',
    blocked: false,
    emailChecked: false,
    password: ''
  }

  constructor(private userService: UserService, private router: Router) { }

  ngOnInit(): void {
  }
  
  auth(): void {
    this.userService.auth(this.user.email, this.user.password).subscribe(res => {
      this.storage.setItem('token_login', res.token)
      window.location.href = '/'
    })
  }

}
