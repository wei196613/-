import { NzMessageService } from 'ng-zorro-antd';
import { Subscription } from 'rxjs';
import { ByValueService } from 'src/app/services/by-value.service';
import { Component, OnInit, Input } from '@angular/core';
import { Validators, FormGroup, FormBuilder, FormControl, AbstractControl } from '@angular/forms';
import { Config } from 'src/app/Config';
import { format } from 'date-fns';
import { GetTaskTypeById, TaskTypeNames, TaskTypeNameItem, ParseExcelRes } from 'src/app/services/my-task.service';


@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.less']
})
export class AddComponent implements OnInit {
  @Input() formConfig: GetTaskTypeById;
  /***是否开启批量导入*/
  @Input() isAdds: boolean;
  /***任务类型*/
  @Input() taskTypeTable: TaskTypeNames;
  taskTypeCheck: TaskTypeNameItem;
  /***保存选中的设备*/
  bindDeviceIds: { name: string, id: number }[];
  /**节流控制定时器*/
  throttle: NodeJS.Timeout
  visible = false;
  modalKey = '';
  current = 0;
  formGroup: FormGroup;
  loginMethodArr = Config.jdLoginMethod;
  executeMethodArr = Config.jdLoginExecute;
  scheduledTimeCode = false;
  sub: Subscription;
  /***解析上传excel的结果*/
  parseExcelRes: ParseExcelRes;
  /**自定义表单的数据;*/
  subform;
  subformValid = false;
  constructor(private fb: FormBuilder,
    private byVal: ByValueService,
    private hintMsg: NzMessageService) { }
  get nameValidtors() {
    return this.isAdds ? [Validators.required] : [];
  }
  ngOnInit() {
    this.formGroup = this.fb.group({
      taskTypeId: [null, [Validators.required]],
      name: [null, this.nameValidtors],
      executeMethod: [null, [Validators.required]],
      paras: [null],
    })
    this.sub = this.byVal.getMeg().subscribe(res => {
      switch (res.key) {
        case 'task_tpe_checked':
          this.formGroup.patchValue({ taskTypeId: res.data.id });
          this.taskTypeCheck = res.data;
          this.handleNext();
          break;
        case 'merge_task_params_success':
          this.formGroup.patchValue({
            paras: res.data
          })
          this.addStart()
          break;
        case 'from_config_success':
          this.current += 1;
          break;
        case 'select_deivce_end':
          this.bindDeviceIds = res.data
          this.onCancel()
          break;
        case 'sub_form_params':
          this.subform = res.data
          break;
        case 'adds_success':
          this.onCancel();
          break;
        case 'parse_excel_success':
          this.parseExcelRes = res.data;
          this.handleOpenModal('adds_detail')
          break;
        case 'sub_form_valid':
          this.subformValid = res.data;
          console.log(res.data);
          break
        default:
          break;
      }
    })
  }
  onOpenFile = true; // 是否代开文件夹弹框 
  get checkedDeviceNumber() {
    return this.bindDeviceIds ? this.bindDeviceIds.length : 0;
  }
  /**上传文件前检查form表单是否填写完成*/
  handleExamine() {
    if (this.checkedDeviceNumber < 1) {
      return this.hintMsg.error('请选择设备')
    }
    this.submitForm(true);
  }
  /* 
  * 解析成功打开二次确认页面
  */
  // 发起添加
  private addStart() {
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
      this.byVal.sendMeg({ key: 'add_start', data })
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
  // 下一步
  handleNext() {
    const v = this.formGroup.get('taskTypeId').value as number;
    if (v) {
      this.byVal.sendMeg({ key: 'get_form_config', data: v });
    } else {
      this.hintMsg.error('请选择任务类型');
    }
  }
  // 上一步
  handlePre() {
    this.current -= 1;
  }

  // 提交表单
  submitForm(isValidity?: boolean) {
    /*     if (this.checkedDeviceNumber < 1) {
          this.hintMsg.error('最少选择一台设备');
        } */
    this.byVal.sendMeg({ key: 'merge_task_params', data: { isValidity } })
    for (const i in this.formGroup.controls) {
      this.formGroup.controls[i].markAsDirty();
      this.formGroup.controls[i].updateValueAndValidity();
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
  // 下载模板
  handleGenTem() {
    this.byVal.sendMeg({ key: 'gen_tem_start' })
  }
  // 上传excel文件
  onBeforeUpload = (file): boolean => {
    if (file) {
      const that = this;
      const fileName = file.name;
      const reader: FileReader = new FileReader();
      reader.onload = (e) => {
        const res = e.target['result'];
        this.byVal.sendMeg({ key: 'parse_excel', data: { excel: res, taskTypeId: this.formGroup.get('taskTypeId').value } });
      }
      reader.readAsDataURL(file);
    }
    return false; // 阻止自动上传
  }
  /**点击上传判断表单验证是否通过*/
  openFile() {
    if (this.throttle) {
      clearTimeout(this.throttle);
    }
    this.throttle = setTimeout(() => {
      console.log('测试111');
    }, 1000);
    return false;
  }

}
