import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit, Input } from '@angular/core';
import { AddressLabelItem, AddressItem, AddressSuffix } from 'src/app/services/jd/address.service';
import { ByValueService } from 'src/app/services/by-value.service';

@Component({
  selector: 'app-address-edit',
  templateUrl: './address-edit.component.html',
  styleUrls: ['./address-edit.component.less']
})
export class AddressEditComponent implements OnInit {
  @Input() data: AddressItem;
  formGroup: FormGroup;
  @Input() labelAll: AddressLabelItem[];
  @Input() suffixlabel: AddressSuffix
  constructor(private fb: FormBuilder, private byVal: ByValueService) { }

  ngOnInit() {
    this.formGroup = this.fb.group({
      id: [this.data.id, [Validators.required]],
      address: [this.data.address, [Validators.required]],
      // stationName: [this.data.stationName, [Validators.required]],
      labelIds: [this.data.labelIds.split(',').map(Number), [Validators.required]],
      suffixId: [this.data.suffixId, [Validators.required]]
    })
  }
  submitForm() {
    // console.log(this.formGroup.value);
    if (this.formGroup.valid) {
      const data = this.formGroup.value;
      this.byVal.sendMeg({ key: 'edit_address_start', data })
    } else {
      for (const i in this.formGroup.controls) {
        this.formGroup.controls[i].markAsDirty();
        this.formGroup.controls[i].updateValueAndValidity();
      }
    }
  }
}
