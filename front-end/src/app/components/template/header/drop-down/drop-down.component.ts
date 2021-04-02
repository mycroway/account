import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-drop-down',
  templateUrl: './drop-down.component.html',
  styleUrls: ['./drop-down.component.css']
})
export class DropDownComponent implements OnInit {

  enable = false

  constructor() {}

  ngOnInit(): void {}

  toVisible(): void {
    this.enable = !this.enable
  }

  toInvisible(): void {
    setTimeout(() => {
      this.enable = false
    })
  }

}