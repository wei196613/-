import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ToolsService } from "../services/tools.service";
import { ActivatedRoute, Router } from "@angular/router";
import { LoginService } from '../services/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less']
})
export class LoginComponent implements OnInit {
  validateForm: FormGroup;
  constructor(private fb: FormBuilder,
    private tools: ToolsService,
    private login: LoginService) {
  }

  submitForm(): void {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }
    if (this.validateForm.valid) {
      const v = this.validateForm.value;
      const params = {
        account: v.phone,
        password: this.tools.MD5(this.tools.MD5(v.password).toUpperCase())
      };
      this.login.login(params);
    }
  }

  get phoneErrorTip() {
    const p = this.validateForm.controls["phone"];
    if (p.hasError("pattern"))
      return "请输入合法的手机号码!";
    return "请输入手机号码!";
  }

  ngOnInit(): void {
    // this.auth.pullSelfInfo();
    this.validateForm = this.fb.group({
      // phone: [null, [Validators.required, Validators.pattern("^1[3456789]\\d{9}$")]],
      phone: [null, [Validators.required]],
      password: [null, [Validators.required]]
    });
  }

}
