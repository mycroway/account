import { Component, OnInit } from '@angular/core';
import { UserService } from './../../../user/user.service'
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-verify',
  templateUrl: './verify.component.html',
  styleUrls: ['./verify.component.css']
})
export class VerifyComponent implements OnInit {
  
  token: string

  constructor(private userService: UserService, private router: Router) { }

  ngOnInit(): void {
  }
  
  verify(): void {
    this.userService.verify(this.token).subscribe(res => {
      window.localStorage.setItem('token_login', res.token)
      this.userService.showMessage(res.msg, false)
      setTimeout(() => {
        location.href = '/'
      }, 500)
    })
  }

}
