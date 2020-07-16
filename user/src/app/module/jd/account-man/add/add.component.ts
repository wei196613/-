import { Subscription } from 'rxjs';
import { ByValueService } from 'src/app/services/by-value.service';
import { Validators, FormArray, FormGroup, FormBuilder, AbstractControl } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.less']
})
export class AddComponent implements OnInit {
  formGroup: FormGroup;
  sub: Subscription
  constructor(private fb: FormBuilder, private byVal: ByValueService) { }

  ngOnInit() {
    this.formGroup = this.fb.group({
      account: [null, [Validators.required]],
      pwd: [null],
      smsUrl: [null],
      couponList: this.fb.array([this.fb.control('', this.some())])
    })
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
    for (const key in this.couponList.controls) {
      this.couponList.controls[key].markAsDirty();
      this.couponList.controls[key].updateValueAndValidity(); 
    }
    const data = {};
    if (this.formGroup.valid) {
      for (const key in this.formGroup.value) {
        if (this.formGroup.value[key] !== null && this.formGroup.value[key] !== undefined && this.formGroup.value[key] !== '') {
          if (key === 'couponList') {
            data[key] = this.formGroup.value.couponList.filter(v => v != null && v != undefined)
          } else {
            data[key] = this.formGroup.value[key]
          }
        }
      }
      this.byVal.sendMeg({ key: 'ADD_START', data })
    }
  }
  removeField(i, e: MouseEvent): void {
    if (this.couponList.length > 1) {
      this.couponList.removeAt(i);
    }
    e.preventDefault();
  }
  addField(e?: MouseEvent): void {
    if (e) {
      e.preventDefault();
    }
    this.couponList.push(this.fb.control(null))
  }
}
