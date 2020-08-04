import { ProductItem } from 'src/app/services/jd/product.service';
import { ByValueService } from 'src/app/services/by-value.service';
import { Component, OnInit, Input } from '@angular/core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.less']
})
export class EditComponent implements OnInit {
  @Input() data: ProductItem
  formGroup: FormGroup;
  constructor(private fb: FormBuilder, private byVal: ByValueService) { }

  ngOnInit() {
    this.formGroup = this.fb.group({
      id: [this.data.id, [Validators.required]],
      productId: [this.data.productId, [Validators.required]],
      price: [this.data.price]
    })
  }
  submitForm() {
    if (this.formGroup.valid) {
      this.byVal.sendMeg({ key: 'edit_start', data: this.formGroup.value })
    } else {
      for (const i in this.formGroup.controls) {
        this.formGroup.controls[i].markAsDirty();
        this.formGroup.controls[i].updateValueAndValidity();
      }
    }
  }
}
