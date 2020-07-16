import { Component, OnInit } from '@angular/core';
import { LoginService } from './../../services/login.service';
import { ToolsService } from 'src/app/services/tools.service';
import { AbstractControl, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
@Component({
  selector: 'app-reg',
  templateUrl: './reg.component.html',
  styleUrls: ['./reg.component.less']
})
export class RegComponent implements OnInit {
  validateForm: FormGroup;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private tools: ToolsService,
    private login: LoginService) {
  }

  same() {
    return (control: AbstractControl) => {
      if (this.validateForm) {
        const p1 = this.validateForm.controls["password1"];
        const p2 = this.validateForm.controls["password2"];
        if (p1.value != p2.value) {
          return {
            same: true
          }
        }
      }
      return null;
    }
  }

  ngOnInit() {
    this.validateForm = this.fb.group({
      account: [null, [Validators.required]],
      password1: [null, [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(12)
      ]],
      password2: [null, [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(12),
        this.same()
      ]],
      inviteCode: [null, [
        Validators.required
      ]]
    });
  }

  private errorTip(c: AbstractControl) {
    if (c.hasError("minlength") || c.hasError("maxlength")) {
      return "密码长度在6~12位字符之间";
    } else if (c.hasError("same")) {
      return "两次密码输入不一致";
    }
    return null;
  }

  password1ErrorTip() {
    const c = this.validateForm.controls["password1"];
    const error = this.errorTip(c);
    if (error != null) {
      return error;
    }
    return "请输入密码";
  }

  password2ErrorTip() {
    const c = this.validateForm.controls["password2"];
    const error = this.errorTip(c);
    if (error != null) {
      return error;
    }
    return "请再输入一次密码";
  }

  submitForm(): void {
    for (const i in this.validateForm.controls) {
      console.log(this.validateForm.controls[i].errors);
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }

    if (this.validateForm.valid) {
      const v = this.validateForm.value;
      const params = {
        account: v.account,
        pwd: this.tools.MD5(this.tools.MD5(v.password1).toUpperCase()),
        inviteCode: v.inviteCode
      };
      /* 修改密码 */
      this.login.userRegister(params);
    }
  }
  back() {
    history.back();
  }
}
