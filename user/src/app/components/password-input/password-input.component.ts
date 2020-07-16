import { AbstractControl, ControlContainer } from '@angular/forms';
import { Component, OnInit, Input, Output, EventEmitter, Optional, Host, SkipSelf } from '@angular/core';

@Component({
  selector: 'app-password-input',
  templateUrl: './password-input.component.html',
  styleUrls: ['./password-input.component.less']
})
export class PasswordInputComponent implements OnInit {
  @Input() formControlName: string;
  @Input() placeholder: string;
  control: AbstractControl;
  constructor(
    @Optional() @Host() @SkipSelf()
    private controlContainer: ControlContainer
  ) { }
  get value() {
    if (this.control) {
      return this.control.value;
    }
    return '';
  }
  ngOnInit() {
    if (this.controlContainer) {
      if (this.formControlName) {
        this.control = this.controlContainer.control.get(this.formControlName);
      } else {
        console.warn('Missing FormControlName directive from host element of the component');
      }
    } else {
      console.warn('Can\'t find parent FormGroup directive');
    }

  }

  passwordVisible = false;
  change() {
    // this.control.patchValue()
    // this.ngModelChange.emit(this.ngModel);
  }
}
