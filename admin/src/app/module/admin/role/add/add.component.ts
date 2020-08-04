import { Validators, FormGroup } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { PermissionsList } from 'src/app/services/entity';
import { Component, OnInit, Input } from '@angular/core';
import { ByValueService } from 'src/app/services/by-value.service';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.less']
})
export class AddComponent implements OnInit {
  @Input() data: PermissionsList;
  formGroup: FormGroup;
 
  params = {
    perPage: 30,
    curPage: 1,
    keyword: null
  }
  getIsChecked(id: number) {
    return this.permissions.some(v => v === id)
  }
  permissions: number[] = []
  constructor(private fb: FormBuilder, private byVal: ByValueService) { }
  ngOnInit() {
    this.formGroup = this.fb.group({
      name: [null, [Validators.required]]
    })
  }


  checkboxChange(e: boolean, id: number) {
    this.permissions = e ? this.permissions.concat(id) : this.permissions.filter(v => v !== id)
  }

  handleGetData(msg?: 'clear') {
    msg === 'clear' ? this.params.curPage = 1 : '';
    this.byVal.sendMeg({ key: 'permission_query', data: this.params })
  }

  submitForm() {
    const data = this.formGroup.value;
    console.log(this.permissions);
    if (this.formGroup.valid) {
      const data = this.formGroup.value;
      this.byVal.sendMeg({ key: 'add_start', data: { name: data.name, permissions: this.permissions } })
    } else {
      for (const i in this.formGroup.controls) {
        this.formGroup.controls[i].markAsDirty();
        this.formGroup.controls[i].updateValueAndValidity();
      }
    }
  }
}
