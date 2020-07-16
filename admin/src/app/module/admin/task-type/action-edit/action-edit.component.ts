import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { Component, OnInit, Input } from '@angular/core';
import { Tags } from 'src/app/services/entity';
import { ByValueService } from 'src/app/services/by-value.service';

@Component({
  selector: 'app-action-edit',
  templateUrl: './action-edit.component.html',
  styleUrls: ['./action-edit.component.less']
})
export class ActionEditComponent implements OnInit {
  formGroup: FormGroup;
  @Input() data: Tags;
  @Input() selectArr: { value: string, name: string }[];
  constructor(private fb: FormBuilder, private byVal: ByValueService) { }

  ngOnInit() {
    this.formGroup = this.fb.group({
      oldName: [{ value: null, disabled: true }, Validators.required],
      oldKey: [{ value: null, disabled: true }, Validators.required],
      newName: [null, [this.some()]],
      newKey: [null, [this.some()]],
      refOrder: [null, [this.some()]],
      defaultValue: [null, [this.some()]],
    })
    this.patchValue();
  }
  private patchValue() {
    if (this.data) {
      const { oldName, oldKey, newName, newKey, refOrder } = this.data;
      this.formGroup.patchValue({ oldName, oldKey, newName, newKey, refOrder })
    }
  }
  some() {
    return () => {
      if (this.formGroup) {
        const name = this.formGroup.get('newName').value;
        const key = this.formGroup.get('newKey').value;
        const order = this.formGroup.get('refOrder').value;
        const defaultValue = this.formGroup.get('defaultValue').value;
        if ((this.hasError(name) && this.hasError(key)) || this.hasError(order) || this.hasError(defaultValue)) {
          return null;
        } else {
          return { some: true }
        }
      }
    }
  }

  private hasError(value) {
    return value != null && value != undefined && value != '';
  }

  submit() {
    for (const i in this.formGroup.controls) {
      this.formGroup.controls[i].markAsDirty();
      this.formGroup.controls[i].updateValueAndValidity();
    }
    console.log(this.formGroup);
    if (this.formGroup.valid) {
      const v = this.formGroup.value;
      for (const key in v) {
        if (!this.hasError(v[key])) {
          v[key] = null;
        }
      }
      this.data.refOrder = v.refOrder;
      this.data.newKey = v.newKey;
      this.data.newName = v.newName;
      this.data.defaultValue = v.defaultValue
      this.byVal.sendMeg({ key: 'edit_tag_success', data: this.data })
    }
  }
}
