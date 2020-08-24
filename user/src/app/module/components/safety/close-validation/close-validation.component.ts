import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ToolsService } from 'src/app/services/tools.service';

@Component({
  selector: 'app-close-validation',
  templateUrl: './close-validation.component.html',
  styleUrls: ['./close-validation.component.less']
})
export class CloseValidationComponent implements OnInit {
  formGroup: FormGroup;
  @Output() formSubmit = new EventEmitter();
  constructor(private fb: FormBuilder, private tools: ToolsService) { }

  ngOnInit(): void {
    this.formGroup = this.fb.group({
      password: [null, [Validators.required, Validators.minLength(6), Validators.maxLength(18)]],
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
    return '请输入认证器中当前显示的验证码'
  }
  /**密码格式验证提示*/
  get passwordErrorTip() {
    const c = this.formGroup?.get('password')
    return c && (c.hasError("minlength") || c.hasError("maxlength")) ? '密码长度在6~18位字符之间' : '请输入密码';
  }
  /**提交*/
  submit() {
    for (const i in this.formGroup.controls) {
      this.formGroup.controls[i].markAsDirty();
      this.formGroup.controls[i].updateValueAndValidity();
    }
    console.log(this.formGroup.valid, this.formGroup.value);
    if (this.formGroup.valid) {
      const value = this.formGroup.value;
      value.totp = Number(value.totp)
      value.password = this.tools.MD5(this.tools.MD5(value.password).toUpperCase())
      this.formSubmit.emit(value);
    }
  }
}
