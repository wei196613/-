import { ByValueService } from 'src/app/services/by-value.service';
import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-address-suffix-add',
  templateUrl: './address-suffix-add.component.html',
  styleUrls: ['./address-suffix-add.component.less']
})
export class AddressSuffixAddComponent implements OnInit {

  formGroup: FormGroup;
  constructor(private fb: FormBuilder, private byVal: ByValueService) { }

  ngOnInit() {
    this.formGroup = this.fb.group({
      name: [null, [Validators.required]],
      content: [null]
    })
  }
  submitForm() {
    if (this.formGroup.valid) {
      const data = this.formGroup.value;
      this.byVal.sendMeg({ key: 'add_address_suffix_start', data })
    } else {
      for (const i in this.formGroup.controls) {
        this.formGroup.controls[i].markAsDirty();
        this.formGroup.controls[i].updateValueAndValidity();
      }
    }
  }
}
