import { NzMessageService } from 'ng-zorro-antd';
import { ByValueService } from 'src/app/services/by-value.service';
import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-address-label-add',
  templateUrl: './address-label-add.component.html',
  styleUrls: ['./address-label-add.component.less']
})
export class AddressLabelAddComponent implements OnInit {
  formGroup: FormGroup;
  constructor(private fb: FormBuilder, private byVal: ByValueService, private hintMsg: NzMessageService) { }

  ngOnInit() {
    this.formGroup = this.fb.group({
      name: [null, [Validators.required]],
      resetDays: [null, [Validators.required]],
      maximum: [null, [Validators.required]]
    })
  }
  submitForm() {
    if (this.formGroup.valid) {
      const data = this.formGroup.value;
      if (data.resetDays < 0 || data.maximum < 0) {
        this.hintMsg.error('重置时间或者每日可用上线不能小于0')
        return
      }
      this.byVal.sendMeg({ key: 'add_address_label_start', data })
    } else {
      for (const i in this.formGroup.controls) {
        this.formGroup.controls[i].markAsDirty();
        this.formGroup.controls[i].updateValueAndValidity();
      }
    }
  }
}
