import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-open-validation',
  templateUrl: './open-validation.component.html',
  styleUrls: ['./open-validation.component.less']
})
export class OpenValidationComponent implements OnInit {
  @Input() safetyInfo: { qr: string; username: string; sk: string; } = null;
  @Output() formSubmit = new EventEmitter();
  formGroup: FormGroup
  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.formGroup = this.fb.group({
      totp: [null, [Validators.required, Validators.pattern(/^[0-9]{6}$/)]]
    })
  }
  /**验证码格式提示*/
  get totpEorrorTip() {
    if (this.formGroup) {
      const totp = this.formGroup.get('totp');
      if (totp?.getError('pattern')) {
        return '验证码格式错误'
      }
    }
    return '请输入验证码'
  }
  /**提交*/
  submit() {
    for (const i in this.formGroup.controls) {
      this.formGroup.controls[i].markAsDirty();
      this.formGroup.controls[i].updateValueAndValidity();
    }
    if (this.formGroup.valid) {
      const value = this.formGroup.value
      value.totp = Number(value.totp)
      this.formSubmit.emit({ ...value, sk: this.safetyInfo.sk });
    }
  }
}
