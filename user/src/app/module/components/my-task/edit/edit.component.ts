import { NzMessageService } from 'ng-zorro-antd';
import { Subscription } from 'rxjs';
import { ByValueService } from 'src/app/services/by-value.service';
import { Component, OnInit, Input } from '@angular/core';
import { Validators, FormGroup, FormBuilder, FormControl, AbstractControl } from '@angular/forms';
import { Config } from 'src/app/Config';
import { format } from 'date-fns';
import { GetTaskTypeById, TaskItem } from 'src/app/services/my-task.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.less', '../add/add.component.less']
})
export class EditComponent implements OnInit {
  @Input() data: TaskItem
  formGroup: FormGroup;
  @Input() isCopy = false;
  @Input() formConfig: GetTaskTypeById
  modalKey = '';
  visible = false;
  loginMethodArr = Config.jdLoginMethod;
  executeMethodArr = Config.jdLoginExecute;
  scheduledTimeCode = false;
  sub: Subscription;
  bindDeviceIds: { name: string, id: number }[]; // 保存选中的设备
  constructor(private fb: FormBuilder,
    private byVal: ByValueService,
    private hintMsg: NzMessageService
  ) { }

  ngOnInit() {
    this.formGroup = this.fb.group({
      taskTypeId: [null, [Validators.required]],
      name: [null],
      executeMethod: [null, [Validators.required]],
      paras: [null]
    })
    this.patchValue();
    this.sub = this.byVal.getMeg().subscribe(res => {
      switch (res.key) {
        case 'merge_task_params_success':
          this.formGroup.patchValue({
            paras: res.data
          })
          this.editStart()
          break;
        case 'select_deivce_end':
          this.bindDeviceIds = res.data;
          this.onCancel()
          break;
      }
    })
  }
  get checkedDeviceNumber() {
    return this.bindDeviceIds ? this.bindDeviceIds.length : 0;
  }
  patchValue() {
    const { tpe, name, bindDevices, executeMethod, scheduledTime } = this.data;
    this.formGroup.patchValue({
      taskTypeId: tpe.id,
      name,
      executeMethod
    })
    this.bindDeviceIds = bindDevices
    if (executeMethod === 3) {
      this.handleExecuteChange(executeMethod);
      this.formGroup.patchValue({
        scheduledTime: scheduledTime * 1000
      })
    }
  }
  // 发起添加
  private editStart() {
    if (this.checkedDeviceNumber < 1) {
      this.hintMsg.error('最少选择一台设备');
      return;
    }
    if (this.formGroup.valid) {
      const data = this.formGroup.value;
      if (data.scheduledTime) {
        data.scheduledTime = format(data.scheduledTime, 'yyyy-MM-dd HH:mm:ss');
      }
      data.bindDeviceIds = this.bindDeviceIds.map(v => v.id);
      this.isCopy ? this.byVal.sendMeg({ key: 'add_start', data }) : this.byVal.sendMeg({ key: 'eidt_start', data: { ...data, id: this.data.id } });
    }
  }
  // 任务执行方式改变
  handleExecuteChange(e) {
    if (e === 3) {
      this.formGroup.addControl("scheduledTime", this.fb.control(null, [Validators.required, this.same()]));
      this.scheduledTimeCode = true;
    } else {
      this.formGroup.removeControl('scheduledTime')
      this.scheduledTimeCode = false;
    }
  }

  // 提交表单
  submitForm() {
    this.byVal.sendMeg({ key: 'merge_task_params' })
    if (!this.formGroup.valid) {
      for (const i in this.formGroup.controls) {
        this.formGroup.controls[i].markAsDirty();
        this.formGroup.controls[i].updateValueAndValidity();
      }
    }
  }
  get dateErrorTip() {
    const p = this.formGroup.controls["scheduledTime"];
    if (p.hasError("time"))
      return "计划执行时间不得早于当前时间";
    return "请选择计划执行时间";
    return '';
  }
  private same() {
    return (control: AbstractControl) => {
      if (this.formGroup) {
        const p = this.formGroup.controls["scheduledTime"];
        if (p && p.value) {
          const p1 = new Date(p.value).getTime()
          const p2 = new Date().getTime()
          if (p1 < p2) {
            return {
              time: true
            }
          }
        }
      }
      return null;
    }
  }
  ngOnDestroy(): void {
    this.sub && this.sub.unsubscribe();
  }
  handleOpenModal(key: string) {
    this.modalKey = key;
    this.visible = true;
  }
  onCancel() {
    this.visible = false
    const timer = setTimeout(() => {
      this.modalKey = '';
      clearTimeout(timer);
    }, 100);
  }
}
