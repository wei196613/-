import { ByValueService } from 'src/app/services/by-value.service';
import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.less']
})
export class AddComponent implements OnInit {
  formGroup: FormGroup;
  constructor(private fb: FormBuilder, private byVal: ByValueService) { }

  ngOnInit() {
    this.formGroup = this.fb.group({
      productId: [null, [Validators.required]],
      price: [null]
    })
  }
  submitForm() {
    if (this.formGroup.valid) {
      this.byVal.sendMeg({ key: 'add_start', data: this.formGroup.value })
    } else {
      for (const i in this.formGroup.controls) {
        this.formGroup.controls[i].markAsDirty();
        this.formGroup.controls[i].updateValueAndValidity();
      }
    }
  }
}
