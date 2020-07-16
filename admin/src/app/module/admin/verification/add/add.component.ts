import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit, Input } from '@angular/core';
import { RolesItem } from 'src/app/services/entity';
import { ByValueService } from 'src/app/services/by-value.service';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.less']
})
export class AddComponent implements OnInit {
  formGroup: FormGroup;
  @Input() roleList: RolesItem[];
  constructor(private fb: FormBuilder, private byVal: ByValueService) { }

  ngOnInit() {
    this.formGroup = this.fb.group({
      name: [null, [Validators.required]],
      roleIds: [null, [Validators.required]],
    })
  }
  submit() {
    if (this.formGroup.valid) {
      this.byVal.sendMeg({ key: 'add_start', data: this.formGroup.value })
    } else {
      for (const key in this.formGroup.controls) {
        this.formGroup.controls[key].markAsDirty();
        this.formGroup.controls[key].updateValueAndValidity();
      }
    }
  }
}
