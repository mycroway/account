import { Component, OnInit } from '@angular/core';
import { UserService } from './../../../../user/user.service'
import { User } from './../../../../user/user.model'


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  
  user: User
  
  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.userService.profile().subscribe(user => {
      this.user = user
    })
  }

}
