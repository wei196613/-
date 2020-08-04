import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit, Input } from '@angular/core';
import { AddressLabelItem, AddressSuffix } from 'src/app/services/jd/address.service';
import { ByValueService } from 'src/app/services/by-value.service';

@Component({
  selector: 'app-address-add',
  templateUrl: './address-add.component.html',
  styleUrls: ['./address-add.component.less']
})
export class AddressAddComponent implements OnInit {
  formGroup: FormGroup;
  @Input() labelAll: AddressLabelItem[];
  @Input() suffixlabel: AddressSuffix[]
  constructor(private fb: FormBuilder, private byVal: ByValueService) { }

  ngOnInit() {
    this.formGroup = this.fb.group({
      addresses: [null, [Validators.required]],
      labelIds: [null, [Validators.required]],
      suffixId: [null, [Validators.required]]
    })
  }
  submitForm() {
    console.log(this.formGroup.value);

    if (this.formGroup.valid) {
      const data = this.formGroup.value;
      data.addresses = data.addresses.split('\n').join(';')
      this.byVal.sendMeg({ key: 'add_address_start', data })
    } else {
      for (const i in this.formGroup.controls) {
        this.formGroup.controls[i].markAsDirty();
        this.formGroup.controls[i].updateValueAndValidity();
      }
    }
  }
}
