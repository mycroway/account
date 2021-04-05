import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from './user/user.service'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  
  storage = window.localStorage
  
  constructor(private router: Router, private userService: UserService) { }
  
  ngOnInit(): void {
  }
}
