import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from './../../user/user.service'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  
  storage = window.localStorage
  
  constructor(private router: Router, private userService: UserService) { }

  ngOnInit(): void {
    this.userService.profile().subscribe()
  }

}
