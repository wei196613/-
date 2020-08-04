import { NzMessageService } from 'ng-zorro-antd';
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
  constructor(private fb: FormBuilder, private byVal: ByValueService, private hintMsg: NzMessageService) { }

  ngOnInit() {
    this.formGroup = this.fb.group({
      oldName: [{ value: null, disabled: true }, Validators.required],
      oldKey: [{ value: null, disabled: true }, Validators.required],
      newKey: [null, [Validators.pattern(/^[a-zA-Z_][a-zA-Z0-9_]{0,}$/)]],
      newName: [null],
      refOrder: [null, [this.refSome()]],
      defaultValue: [null]
    })
    this.patchValue();
  }
  private patchValue() {
    if (this.data) {
      const { oldName, oldKey, newName, newKey, refOrder, defaultValue } = this.data;
      this.formGroup.patchValue({ oldName, oldKey, newName, newKey, refOrder, defaultValue });
    }
  }

  handleInputChange(value: string, key: string) {
    const name = this.formGroup.get(key);
    if (this.hasError(value)) {
      name.setValidators(Validators.required);
    } else {
      name.clearValidators();
      name.updateValueAndValidity();
    }
  }


  private refSome() {
    return () => {
      if (this.formGroup) {
        const name = this.formGroup.get('newName');
        const key = this.formGroup.get('newKey');
        const order = this.formGroup.get('refOrder').value;
        const defaultValue = this.formGroup.get('defaultValue');
        if (this.hasError(order)) {
          name.disable();
          key.disable();
          defaultValue.disable();
        } else {
          name.enable();
          key.enable();
          defaultValue.enable();
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
    if (this.formGroup.valid) {
      const v = this.formGroup.value;
      for (const key in v) {
        if (!this.hasError(v[key])) {
          v[key] = null;
        }
      }
      this.byVal.sendMeg({ key: 'edit_tag_success', data: v })
    }
  }
  /**默认值提示*/
  get tioltipTitle() {
    const { tpe } = this.data
    return tpe === 6 ? 'stringList类型默认值请输入{spilt："," ,value: ["test1","test2"]}格式' : null;
  }
  /**键值命名不符合规则错误提示*/
  handleGetErrorTip(abs: AbstractControl) {
    return abs && abs.hasError('pattern') ? '键值命名规则不正确，应以字母或者下划线开头,由字母数字下划线组成' : '请输入名称';
  }
}
