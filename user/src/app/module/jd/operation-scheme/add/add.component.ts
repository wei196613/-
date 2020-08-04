import { Config } from 'src/app/Config';
import { categoryArr } from 'src/app/services/jd/coupon.service';

import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { ByValueService } from 'src/app/services/by-value.service';
import { OperationSchService, payment, CouponConfItem, AddressLabelList, AddProgram } from 'src/app/services/jd/operationSch.service';
import { AppSpinService } from 'src/app/components/spin-mask/app-spin.service';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.less']
})
export class AddComponent implements OnInit {
  payment = payment;
  formGroup: FormGroup;
  categoryArr = categoryArr;
  couponAll: CouponConfItem[];
  couponSeeAll: CouponConfItem[]
  addressAll: AddressLabelList[];
  loginType = Config.loginType;

  constructor(private fb: FormBuilder, private spin: AppSpinService, private byVal: ByValueService, private operSch: OperationSchService) { }

  ngOnInit() {
    this.formGroup = this.fb.group({
      name: [null, [Validators.required]],
      finalPrice: [null, [Validators.required]],
      flyModeSec: [null, [Validators.required]],
      payment: [0, [Validators.required]],
      loginType: [null, [Validators.required]],
      isRunJx: [0, [Validators.required]],
      category: [1],
      couponIds: [null],


      addressLabels: [null]
    })
    this.getAll();
  }
  submitForm() {
    if (this.formGroup.valid) {
      const value = this.formGroup.value
      const data: AddProgram = {
        name: null,
        finalPrice: null,
        flyModeSec: null,
        payment: null,
        loginType: null,
        isRunJx: null
      }
      for (const key in value) {
        if (value[key] != null || value[key] != undefined) {
          data[key] = value[key]
        } else if (key === 'couponIds' || key === 'addressLabels') {
          data[key] = [];
        }
      }
      if (value.category === 0) {
        data.addressLabels = [this.addressAll[0].id];
      }
      data.isRunJx = Number(data.isRunJx);
      data.flyModeSec = String(data.flyModeSec);
      this.byVal.sendMeg({ key: 'add_start', data })
    } else {
      for (const i in this.formGroup.controls) {
        this.formGroup.controls[i].markAsDirty();
        this.formGroup.controls[i].updateValueAndValidity();
      }
    }
  }
  async getAll() {
    this.spin.open('获取数据中')
    try {
      const couponAll = await this.operSch.getCouponConfList();
      const addressAll = await this.operSch.getAddressLabelList();
      this.couponAll = couponAll;
      this.addressAll = addressAll;
      this.handleRadioChange();
      this.spin.close();
    } catch (error) {

      this.spin.close();
    }
  }

  handleRadioChange() {
    this.formGroup.get('couponIds').reset();
    this.formGroup.get('addressLabels').reset();
    this.couponSeeAll = this.couponAll.filter(({ category }) => category === this.formGroup.get('category').value)
  }
}
