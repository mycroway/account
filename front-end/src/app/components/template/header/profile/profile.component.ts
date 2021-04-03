import { Component, OnInit } from '@angular/core';
import { UserService } from './../../../../user/user.service'
import { User } from './../../../../user/user.model'


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  
  storage = window.localStorage
  enable = false
  user: User
  
  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.userService.profile().subscribe(user => {
      this.user = user
    })
  }
  
  toVisible(): void {
    this.enable = !this.enable
  }

  toInvisible(): void {
    setTimeout(() => {
      this.enable = false
    }, 100)
  }

}
