import { NzMessageService } from 'ng-zorro-antd';
import { Subscription } from 'rxjs';
import { AbstractControl } from '@angular/forms';
import { Validators, FormGroup, FormArray } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { Component, OnInit, Input } from '@angular/core';
import { ByValueService } from 'src/app/services/by-value.service';
import { CloudEntranceItem } from 'src/app/services/cloudEntrance.service';
import { UserAccountItem } from 'src/app/components/user-account/user-account.component';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.less']
})
export class EditComponent implements OnInit {
  /**导入的json*/
  inputJson: string;
  /**控制弹框是否打开*/
  visible = false;
  /**弹框类型*/
  // modalKey = '';
  /**保存用户的信息*/
  userInfo: UserAccountItem;
  /**该对话框类型*/
  @Input() parentKey: string;
  @Input() data: CloudEntranceItem;
  formGroup: FormGroup;
  sub: Subscription;
  constructor(private fb: FormBuilder, private byVal: ByValueService, private hintMsg: NzMessageService) { }
  ngOnInit() {
    this.formGroup = this.fb.group({
      deviceNum: [null, [Validators.required]],
      userId: [null, [Validators.required]]
    })
    this.patchValue();
  }
  /**填充form value*/
  private patchValue() {
    if (this.parentKey === 'open_edit') {
      const { deviceNum, user } = this.data;
      this.formGroup.patchValue({
        deviceNum, userId: user.id
      });
    }
  }

  submitForm() {
    for (const i in this.formGroup.controls) {
      this.formGroup.controls[i].markAsDirty();
      this.formGroup.controls[i].updateValueAndValidity();
    }
    const data = this.formGroup.value;
    if (this.formGroup.valid) this.byVal.sendMeg({ key: 'edit_start', data });
  }

  /**将JSON自动填充进form表单中*/
  patchValueJSON() {
    /*     if (this.inputJson == null || this.inputJson == undefined || this.inputJson == '') {
          return this.hintMsg.error('请输入要导入的JSON');
        }
        const value = JSON.parse(this.inputJson) as AddAction;
        this.patchValue(value); */
    this.onCancel();
  }
  /**关闭 | 打开 对话框*/
  onCancel() {
    this.visible = !this.visible;
  }

  hasError(i: AbstractControl) {
    return !i.pristine && !i.valid;
  }

  ngOnDestroy(): void {
    this.sub && this.sub.unsubscribe()
  }
  /**
   * handlePatchUserId 添加用户id
   */
  public handlePatchUserId(data: UserAccountItem) {
    this.userInfo = data;
    this.formGroup.patchValue({ userId: data.id });
    this.onCancel()
  }
}
