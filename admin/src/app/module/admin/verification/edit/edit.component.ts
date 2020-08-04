import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit, Input } from '@angular/core';
import { RolesItem } from 'src/app/services/entity';
import { ByValueService } from 'src/app/services/by-value.service';
import { RoleGroupItem } from 'src/app/services/roleGroup.service';


@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.less']
})
export class EditComponent implements OnInit {
  formGroup: FormGroup;
  @Input() roleList: RolesItem[];
  @Input() data: RoleGroupItem;
  constructor(private fb: FormBuilder, private byVal: ByValueService) { }

  ngOnInit() {
    this.formGroup = this.fb.group({
      name: [null, [Validators.required]],
      id: [null, [Validators.required]],
      roleIds: [null, [Validators.required]],
    })
    if (this.data && this.formGroup) {
      const { id, name, roles } = this.data;
      this.formGroup.patchValue({
        id, name,
        roleIds: roles.map(v => v.id)
      })
    }
  }
  submit() {
    if (this.formGroup.valid) {
      this.byVal.sendMeg({ key: 'edit_start', data: this.formGroup.value })
    } else {
      for (const key in this.formGroup.controls) {
        this.formGroup.controls[key].markAsDirty();
        this.formGroup.controls[key].updateValueAndValidity();
      }
    }
  }
}
