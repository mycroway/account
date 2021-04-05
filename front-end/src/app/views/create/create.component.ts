import { Component, OnInit } from '@angular/core';
import { User } from './../../user/user.model'
import { UserService } from './../../user/user.service'
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent implements OnInit {

  user: User = {
    name: '',
    email: '',
    gender: 'male',
    role: '',
    blocked: false,
    emailChecked: false,
    password: ''
  }
  password2 = ''
  storage = window.localStorage

  constructor(private userService: UserService, private router: Router) { }

  ngOnInit(): void {
  }
  
  create(): void {
    if (this.password2 != this.user.password) {
      this.userService.showMessage('As duas senhas que você inseriu não são iguais!', true)
    } else {
      this.userService.create(this.user).subscribe(res => {
        this.userService.showMessage(res.msg, false)
        this.router.navigate(['/verify'])
      })
    }
  }

}
