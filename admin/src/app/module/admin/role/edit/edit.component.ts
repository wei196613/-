import { Validators, FormGroup } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { PermissionsList, RolesItem } from 'src/app/services/entity';
import { Component, OnInit, Input } from '@angular/core';
import { ByValueService } from 'src/app/services/by-value.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.less']
})
export class EditComponent implements OnInit {

  @Input() data: PermissionsList;
  @Input() checkData: RolesItem;
  formGroup: FormGroup;
  params = { 
    perPage: 30,
    curPage: 1,
    keyword: null
  }
  permissions: number[] = []
  constructor(private fb: FormBuilder, private byVal: ByValueService) { }
  ngOnInit() {
    this.formGroup = this.fb.group({
      name: [null, [Validators.required]],
      id: [null, [Validators.required]]
    })
    this.formGroup.patchValue({
      name: this.checkData.name,
      id: this.checkData.id
    })
    this.permissions = this.checkData.permissions;
  }


  checkboxChange(e: boolean, id: number) {
    this.permissions = e ? this.permissions.concat(id) : this.permissions.filter(v => v !== id)
  }

  handleGetData(msg?: 'clear') {
    msg === 'clear' ? this.params.curPage = 1 : '';
    this.byVal.sendMeg({ key: 'permission_query', data: this.params })
  }

  getIsChecked(id: number) {
    return this.permissions.some(v => v === id)
  }

  submitForm() {
    const data = this.formGroup.value;
    console.log(this.permissions);
    if (this.formGroup.valid) {
      const data = this.formGroup.value;
      this.byVal.sendMeg({ key: 'edit_start', data: { ...data, permissions: this.permissions } })
    } else {
      for (const i in this.formGroup.controls) {
        this.formGroup.controls[i].markAsDirty();
        this.formGroup.controls[i].updateValueAndValidity();
      }
    }
  }
}
