import { Config } from 'src/app/Config';
import { categoryArr } from 'src/app/services/jd/coupon.service';

import { Component, OnInit, Input } from '@angular/core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { ByValueService } from 'src/app/services/by-value.service';
import { OperationSchService, payment, CouponConfItem, AddressLabelList, ProgramItem } from 'src/app/services/jd/operationSch.service';
import { AppSpinService } from 'src/app/components/spin-mask/app-spin.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.less']
})
export class EditComponent implements OnInit {
  loginType = Config.loginType
  @Input() data: ProgramItem;
  @Input() isCopy = false;
  payment = payment;
  categoryArr = categoryArr;
  formGroup: FormGroup;
  couponAll: CouponConfItem[];
  couponSeeAll: CouponConfItem[]
  addressAll: AddressLabelList[];
  constructor(private fb: FormBuilder, private spin: AppSpinService, private byVal: ByValueService, private operSch: OperationSchService) { }

  ngOnInit() {
    this.formGroup = this.fb.group({
      // id: [this.data.id, [Validators.required]],
      name: [this.data.name, [Validators.required]],
      finalPrice: [this.data.finalPrice, [Validators.required]],
      flyModeSec: [this.data.flyModeSec, [Validators.required]],
      payment: [this.data.payment, [Validators.required]],
      loginType: [this.data.loginType, [Validators.required]],
      category: [null],
      couponIds: [null, [Validators.required]],
      isRunJx: [null, [Validators.required]],
      addressLabels: [null]
    })
    this.getAll();
  }

  patchValue() {
    if (this.data.loginType) {
      this.formGroup.patchValue({
        loginType: this.data.loginType,
        isRunJx: !!this.data.isRunJx
      })
    }
    if (this.data.couponIds && this.data.couponIds.length > 0) {
      const arr = this.data.couponIds.split(',').map(Number)
      this.formGroup.patchValue({
        couponIds: arr,
        category: this.couponAll.find(({ id }) => arr.some(v => v === id)).category
      })
    }
    if (this.data.labelIds && this.data.labelIds.length > 0) {
      this.formGroup.patchValue({
        addressLabels: this.data.labelIds.split(',').map(Number)
      })
    }
  }

  submitForm() {
    for (const i in this.formGroup.controls) {
      this.formGroup.controls[i].markAsDirty();
      this.formGroup.controls[i].updateValueAndValidity();
    }
    if (this.formGroup.valid) {
      const data = this.formGroup.value;
      data.isRunJx = Number(data.isRunJx);
      data.flyModeSec = String(data.flyModeSec);
      if (data.category === 0) {
        data.addressLabels = [this.addressAll[0].id];
      }
      delete data.category;
      this.isCopy ? this.byVal.sendMeg({ key: 'add_start', data }) : this.byVal.sendMeg({ key: 'edit_start', data: { ...data, id: this.data.id } })
    }
  }
  async getAll() {
    this.spin.open('获取数据中')
    try {
      const couponAll = await this.operSch.getCouponConfList();
      const addressAll = await this.operSch.getAddressLabelList();
      this.couponAll = couponAll;
      this.patchValue()
      this.addressAll = addressAll;
      this.spin.close();
    } catch (error) {
      this.spin.close();

    }
  }

  handleInitialize() {
    const i = Number(this.data.couponIds.split(',')[0]);
    const v = this.couponAll.find(({ id }) => id === i).category;
    this.couponSeeAll = this.couponAll.filter(({ category }) => category === v);
    this.formGroup.patchValue({
      id: this.data.id,
      name: this.data.name,
      finalPrice: this.data.finalPrice,
      flyModeSec: this.data.flyModeSec,
      payment: this.data.payment,
      category: v,
      couponIds: this.data.couponIds.split(',').map(Number),
      addressLabels: this.data.labelIds.split(',').map(Number)
    })
  }

  handleRadioChange() {
    // this.formGroup.get('couponIds').reset();
    // this.formGroup.get('addressLabels').reset();
    this.couponSeeAll = this.couponAll.filter(({ category }) => category === this.formGroup.get('category').value)
  }
}
