import { Component, OnInit } from '@angular/core';
import { UserService } from './../../../user/user.service'
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-forgot',
  templateUrl: './forgot.component.html',
  styleUrls: ['./forgot.component.css']
})
export class ForgotComponent implements OnInit {
  
  email = ''
  
  constructor(private userService: UserService, private router: Router) { }

  ngOnInit(): void {
  }
  
  forgot(): void {
    this.userService.forgot(this.email).subscribe(res => {
      this.userService.showMessage(res.msg, false)
      this.router.navigate(['/password/token'])
    })
  }

}
