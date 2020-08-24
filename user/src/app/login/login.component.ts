import { AppSpinService } from './../components/spin-mask/app-spin.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ToolsService } from "../services/tools.service";
import { ActivatedRoute, Router } from "@angular/router";
import { LoginService } from '../services/login.service';
import { NzMessageService } from 'ng-zorro-antd';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less']
})
export class LoginComponent implements OnInit {
  /**控制对话框*/
  visible = false;
  /**登录表单控件*/
  validateForm: FormGroup;
  constructor(private fb: FormBuilder,
    private tools: ToolsService,
    private login: LoginService,
    private hintMsg: NzMessageService,
    private spin: AppSpinService) {
  }
  /**提交按钮*/
  async submitForm() {
    try {
      for (const i in this.validateForm.controls) {
        this.validateForm.controls[i].markAsDirty();
        this.validateForm.controls[i].updateValueAndValidity();
      }
      if (this.validateForm.valid) {
        const v = this.validateForm.value;
        const params = {
          account: v.phone,
          password: this.tools.MD5(this.tools.MD5(v.password).toUpperCase()),
        };
        if (this.visible) {
          params['totp'] = Number(v.totp);
        }
        await this.login.login(params);
      }
    } catch (error) {
      if (error.message === '449') {
        const c = this.validateForm?.get('totp');
        c.enable();
        c.reset();
        this.onCancel();
      } else {
        this.hintMsg.error(error.message)
      }
      this.spin.close();
    }
  }

  get phoneErrorTip() {
    const p = this.validateForm.controls["phone"];
    if (p.hasError("pattern"))
      return "请输入合法的手机号码!";
    return "请输入手机号码!";
  }

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      // phone: [null, [Validators.required, Validators.pattern("^1[3456789]\\d{9}$")]],
      phone: [null, [Validators.required]],
      password: [null, [Validators.required]],
      totp: [{ value: null, disabled: true }, [Validators.required, Validators.pattern(/^[0-9]{6}$/)]],
    });
  }

  onCancel() {
    this.visible = !this.visible;
  }
  /**验证码格式提示*/
  get totpEorrorTip() {
    if (this.validateForm) {
      const totp = this.validateForm.get('totp');
      if (totp?.getError('pattern')) {
        return '验证码格式错误'
      }
    }
    return '请输入验证码'
  }
  patchValue(e: number) {
    this.validateForm.patchValue({
      totp: e
    })
  }
}
