import { AddressSuffix } from 'src/app/services/jd/address.service';
import { ByValueService } from 'src/app/services/by-value.service';
import { Component, OnInit, Input } from '@angular/core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-address-suffix-edit',
  templateUrl: './address-suffix-edit.component.html',
  styleUrls: ['./address-suffix-edit.component.less']
})
export class AddressSuffixEditComponent implements OnInit {
  @Input() data: AddressSuffix
  formGroup: FormGroup;
  constructor(private fb: FormBuilder, private byVal: ByValueService) { }

  ngOnInit() {
    this.formGroup = this.fb.group({
      id: [this.data.id, [Validators.required]],
      name: [this.data.name, [Validators.required]],
      content: [this.data.content]
    })
  }
  submitForm() {
    if (this.formGroup.valid) {
      const data = this.formGroup.value;
      this.byVal.sendMeg({ key: 'edit_address_suffix_start', data })
    } else {
      for (const i in this.formGroup.controls) {
        this.formGroup.controls[i].markAsDirty();
        this.formGroup.controls[i].updateValueAndValidity();
      }
    }
  }
}
