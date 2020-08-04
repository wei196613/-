import { categoryArr, CouponItem } from 'src/app/services/jd/coupon.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ByValueService } from 'src/app/services/by-value.service';
import { Component, OnInit, Input } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.less']
})
export class EditComponent implements OnInit {
  @Input() data: CouponItem;
  formGroup: FormGroup;
  sub: Subscription
  categoryArr = categoryArr

  constructor(private byVal: ByValueService, private fb: FormBuilder) { }

  ngOnInit() {
    this.formGroup = this.fb.group({
      oldName: [null, Validators.required],
      newName: [null],
      full: [null, Validators.required],
      discount: [null, Validators.required],
      category: [null, Validators.required]
    })
    this.sub = this.byVal.getMeg().subscribe(res => {
      switch (res.key) {
        case 'edit_coupon_success':
          this.formGroup.reset();
          break;
        case 'open_coupon_edit':
          this.formGroup.markAsPristine();
          this.formGroup.patchValue({
            oldName: res.data.name,
            full: res.data.full,
            discount: res.data.discount,
            category: res.data.category
          })

          break;
      }
    })
  }
  submitForm() {
    if (this.formGroup.valid && !this.formGroup.pristine) {
      console.log(this.formGroup);
      // console.log(this.formGroup.value);
      const value = this.formGroup.value;
      let data = {
        oldName: null, //旧名字
        newName: null,//新名字
        full: null,//满
        discount: null,//减
        category: null//类型
      };
      for (const key in value) {
        if (key === 'newName' && (!value[key] || value[key] === '')) {
          data.newName = value.oldName;
        } else if (key === 'full' || key === 'discount') {
          data[key] = Math.abs(value[key]).toString();
        } else {
          data[key] = value[key]
        }
      }
      console.log(data);

      this.byVal.sendMeg({ key: 'coupon_edit', data })
    } else {
      for (const i in this.formGroup.controls) {
        this.formGroup.controls[i].markAsDirty();
        this.formGroup.controls[i].updateValueAndValidity();
      }
    }
  }
  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
   this.sub &&  this.sub.unsubscribe();
  }
}
