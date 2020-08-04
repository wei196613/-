
import { Component, OnInit } from '@angular/core';
@Component({
  selector: 'app-main',
  template: '<router-outlet></router-outlet>'
})
export class MainComponent implements OnInit {
  constructor() {
  }
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.

  }
}
