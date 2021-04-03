import { Component, OnInit } from '@angular/core';
import { User } from './../../user/user.model'
import { UserService } from './../../user/user.service'
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  
  user: User

  constructor(private userService: UserService, private router: Router) { }

  ngOnInit(): void {
    this.userService.profile().subscribe(user => {
      this.user = user
    })
  }
  
  deleteAccount(): void {
    alert('deleted')
    this.router.navigate(['/'])
  }
  
  updateAccount(): void {
    alert('updated')
    this.router.navigate(['/'])
  }

}
