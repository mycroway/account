import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  
  storage = window.localStorage
  
  constructor(private router: Router) { }

  ngOnInit(): void {
    var token_login = this.storage.getItem('token_login')
    
    if (!token_login) {
      this.router.navigate(['/login'])
    }
  }

}
