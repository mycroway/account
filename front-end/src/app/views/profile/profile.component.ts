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
  storage = window.localStorage

  constructor(private userService: UserService, private router: Router) { }

  ngOnInit(): void {
    var token_login = this.storage.getItem('token_login')
    
    if (!token_login) {
      this.router.navigate(['/login'])
    } else {
      this.userService.profile().subscribe(user => {
        this.user = user
      })
    }
  }
  
  deleteAccount(): void {
    this.userService.delete().subscribe(msg => {
      this.storage.removeItem('token_login')
      window.location.href = 'http://mycroway.com'
    })
  }
  
  updateAccount(): void {
    this.userService.update(this.user).subscribe(user => {
      this.userService.showMessage('Dados atualizados com sucesso!', false)
      this.router.navigate(['/'])
    })
  }

}
