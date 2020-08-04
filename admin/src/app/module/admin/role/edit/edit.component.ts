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
  /**对话框状态*/
  visible = false;
  /**保存任务可见性配置*/
  taskTypeVisible = null;
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
    this.taskTypeVisible = { copyRoleId: this.checkData.id, ids: [] };
    this.permissions = this.checkData.permissions;
    console.log(this.permissions);
    
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
    if (this.formGroup.valid) {
      const data = this.formGroup.value;
      let taskTypeVisible: { [s: string]: any } = {};
      if (this.taskTypeVisible.useDefault) {
        taskTypeVisible.useDefault = this.taskTypeVisible.useDefault;
      }
      if (!(this.taskTypeVisible.copyRoleId === this.checkData.id)) {
        taskTypeVisible.copyRoleId = this.taskTypeVisible.copyRoleId
      }
      if (this.taskTypeVisible.ids) {
        taskTypeVisible.ids = this.taskTypeVisible.ids;
      } else {
        taskTypeVisible.ids = [];
      }
      this.byVal.sendMeg({ key: 'edit_start', data: { ...data, permissions: this.permissions, taskTypeVisible } })
    } else {
      for (const i in this.formGroup.controls) {
        this.formGroup.controls[i].markAsDirty();
        this.formGroup.controls[i].updateValueAndValidity();
      }
    }
  }
  /**打开对话框*/
  handleOpenModal() {
    this.visible = true;
  }
  /**关闭对话框*/
  onCancel() {
    this.visible = false;
  }
  /**任务可见配置变化事件*/
  handleTaskSelectChange(e) {
    console.log(e);
    this.taskTypeVisible = e;
    this.onCancel();
  }
}
