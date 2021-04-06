import { Component, OnInit } from '@angular/core';
import { UserService } from './../../../user/user.service'
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-token',
  templateUrl: './token.component.html',
  styleUrls: ['./token.component.css']
})
export class TokenComponent implements OnInit {
  
  token = ''

  constructor(private userService: UserService, private router: Router) { }

  ngOnInit(): void {
  }
  
  tokenSave(): void {
    var res = this.userService.saveToken(this.token)
    if (res) {
      this.router.navigate(['/password/reset'])
    }
  }

}
