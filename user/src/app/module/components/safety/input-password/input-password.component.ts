import { Subscription } from 'rxjs';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ToolsService } from 'src/app/services/tools.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ByValueService } from 'src/app/services/by-value.service';

@Component({
  selector: 'app-input-password',
  templateUrl: './input-password.component.html',
  styleUrls: ['./input-password.component.less']
})
export class InputPasswordComponent implements OnInit {
  @Output() formSubmit = new EventEmitter<{ password: string, totp: number }>();
  /**密码输入框的表单*/
  formGroup: FormGroup;
  byVal$: Subscription;
  visible = false;
  constructor(private fb: FormBuilder, private tools: ToolsService, private byVal: ByValueService) { }

  ngOnInit(): void {
    this.formGroup = this.fb.group({
      password: [null, Validators.required],
      totp: [{ value: null, disabled: true }, [Validators.required, Validators.pattern(/^[0-9]{6}$/)]]
    })
    this.byVal$ = this.byVal.getMeg().subscribe(res => {
      if (res.key === '449') {
        this.formGroup.get('totp')?.enable();
        this.visible = true;
      }
    })
  }
  submit() {
    for (const i in this.formGroup.controls) {
      this.formGroup.controls[i].markAsDirty();
      this.formGroup.controls[i].updateValueAndValidity();
    }
    if (this.formGroup.valid) {
      const params = { password: null, totp: null };
      const value = this.formGroup.value;
      params.password = this.tools.MD5(this.tools.MD5(value.password).toUpperCase());
      if (value.totp != null || value.totp != undefined) {
        params.totp = Number(value.totp);
      } else {
        delete params.totp;
      }
      this.formSubmit.emit(params)
    }
  }
  handleAuthCodeChange(e: number) {
    this.formGroup.patchValue({ totp: e });
  }
  onCancel() {
    this.visible = !this.visible;
  }
}
