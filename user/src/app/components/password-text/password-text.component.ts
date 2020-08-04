import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-password-text',
  templateUrl: './password-text.component.html',
  styleUrls: ['./password-text.component.less']
})
export class PasswordTextComponent implements OnInit {
  @Input() visible = false;
  @Input() text: string;
  @Output() visibleChange = new EventEmitter<boolean>();
  constructor() { }

  ngOnInit() {
  }
  handleClcik() {
    this.visible = !this.visible;
    this.visibleChange.emit(this.visible)
  }
}
