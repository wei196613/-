import { AddressLabelItem } from 'src/app/services/jd/address.service';
import { NzMessageService } from 'ng-zorro-antd';
import { ByValueService } from 'src/app/services/by-value.service';
import { Component, OnInit, Input } from '@angular/core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-address-label-edit',
  templateUrl: './address-label-edit.component.html',
  styleUrls: ['./address-label-edit.component.less']
})
export class AddressLabelEditComponent implements OnInit {
  @Input() data: AddressLabelItem;
  formGroup: FormGroup;
  constructor(private fb: FormBuilder, private byVal: ByValueService, private hintMsg: NzMessageService) { }

  ngOnInit() {
    this.formGroup = this.fb.group({
      id: [this.data.id, [Validators.required]],
      name: [this.data.name, [Validators.required]],
      resetDays: [this.data.resetDays, [Validators.required]],
      maximum: [this.data.maximum, [Validators.required]]
    })
  }
  submitForm() {
    if (this.formGroup.valid) {
      const data = this.formGroup.value;
      if (data.resetDays < 0 || data.maximum < 0) {
        this.hintMsg.error('重置时间或者每日可用上线不能小于0')
        return
      }
      this.byVal.sendMeg({ key: 'edit_address_label_start', data })
    } else {
      for (const i in this.formGroup.controls) {
        this.formGroup.controls[i].markAsDirty();
        this.formGroup.controls[i].updateValueAndValidity();
      }
    }
  }
}
