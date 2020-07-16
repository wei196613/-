import { AccountItem } from 'src/app/services/jd/accountMan.service';
import { Component, OnInit, Input } from '@angular/core';
import { ByValueService } from 'src/app/services/by-value.service';
import { Validators, FormArray, FormGroup, FormBuilder, AbstractControl } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.less']
})
export class EditComponent implements OnInit {
  @Input() data: AccountItem;
  formGroup: FormGroup;
  sub: Subscription;
  constructor(private fb: FormBuilder, private byVal: ByValueService) { }

  ngOnInit() {
    this.formGroup = this.fb.group({
      id: [this.data.id],
      account: [this.data.account, [Validators.required]],
      pwd: [this.data.pwd],
      smsUrl: [this.data.url],
      couponList: this.fb.array([])
    })
    this.sub = this.byVal.getMeg().subscribe((res) => {
      if (res.key === 'EDIT') {
        this.initialValue()
      }
    })
    this.initialValue()
  }

  initialValue() {
    this.couponList.clear();
    if (this.data && this.data.coupon) {
      const coupon = this.data.coupon.split(',');
      coupon.forEach((v, i) => {
        if (i === 0) {
          this.couponList.push(this.fb.control({ value: v, disabled: true }))
        } else {
          console.log(v);
          this.couponList.push(this.fb.control({ value: v, disabled: true }))
        }
      })
    } else {
      this.couponList.push(this.fb.control(null, this.some()))
    }
  }
  private some() {
    return (v: AbstractControl) => {
      if (this.formGroup) {
        const pwd = this.formGroup.get('pwd').value;
        if (pwd !== null && pwd !== undefined && pwd !== '') {
          if (v.value === null || v.value === undefined || v.value === '') {
            return { required: true }
          }
        }
      }
      return null;
    }
  }

  get couponList(): FormArray {
    return this.formGroup.get('couponList') as FormArray;
  }

  submitForm() {
    for (const i in this.formGroup.controls) {
      this.formGroup.controls[i].markAsDirty();
      this.formGroup.controls[i].updateValueAndValidity();
    }
    for (const i of this.couponList.controls) {
      i.markAsDirty();
      i.updateValueAndValidity();
    }
    if (this.formGroup.valid) {
      const value = this.formGroup.value, data: any = {};
      for (const key in value) {
        if (value[key] !== null && value[key] !== undefined && value[key] !== '') {
          data[key] = value[key];
        }
      }
      if (!data.couponList) {
        if (this.data && this.data.coupon)
          data.couponList = this.data.coupon.split(',')
      } else {
        if (this.data && this.data.coupon)
          data.couponList.push(...this.data.coupon.split(','))
      }
      if (data && data.couponList) {
        data.couponList = data.couponList.filter(v => v != null && v != undefined)
      }
      this.byVal.sendMeg({ key: 'EDIT_START', data })
    }
  }
  removeField(i, e: MouseEvent): void {
    e.preventDefault();
    if (this.couponList.length > 1) {
      this.couponList.removeAt(i);
    }
  }
  addField(e?: MouseEvent): void {
    if (e) {
      e.preventDefault();
    }
    this.couponList.push(this.fb.control(null))
  }
  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.sub && this.sub.unsubscribe()
  }
}
