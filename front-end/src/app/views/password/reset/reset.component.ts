import { Component, OnInit } from '@angular/core';
import { UserService } from './../../../user/user.service'
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-reset',
  templateUrl: './reset.component.html',
  styleUrls: ['./reset.component.css']
})
export class ResetComponent implements OnInit {
  
  password = ''
  password2 = ''

  constructor(private userService: UserService, private router: Router) { }

  ngOnInit(): void {
  }
  
  resetPassword(): void {
    if (this.password == this.password2) {
      this.userService.resetPassword(this.password).subscribe(res => {
        this.userService.showMessage(res.msg, false)
        this.router.navigate(['/'])
      })
    } else {
      this.userService.showMessage('As senhas não são iguais!', true)
    }
  }

}
