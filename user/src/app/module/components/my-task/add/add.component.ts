import { NzMessageService } from 'ng-zorro-antd';
import { Subscription } from 'rxjs';
import { ByValueService } from 'src/app/services/by-value.service';
import { Component, OnInit, Input } from '@angular/core';
import { Validators, FormGroup, FormBuilder, FormControl, AbstractControl } from '@angular/forms';
import { Config } from 'src/app/Config';
import { format } from 'date-fns';
import { GetTaskTypeById, TaskTypeNames, TaskTypeNameItem, ParseExcelRes, TaskItem } from 'src/app/services/my-task.service';


@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.less']
})
export class AddComponent implements OnInit {
  /**传入修改的数据*/
  @Input() data: TaskItem
  /**自定义表单配置*/
  @Input() formConfig: GetTaskTypeById;
  /**当前组件的类型*/
  @Input() parentKey: 'open_edit' | 'open_add' | 'open_adds' | 'open_copy' | 'open_result' | 'open_export' | 'open_time';
  /***任务类型*/
  @Input() taskTypeTable: TaskTypeNames;
  /**保存选中的任务*/
  taskTypeCheck: TaskTypeNameItem;
  /***保存选中的设备*/
  bindDeviceIds: { name: string, id: number }[];
  /**节流控制定时器*/
  throttle: NodeJS.Timeout;
  /**控制是否打开对话框*/
  visible = false;
  /**控制打开对话框类型*/
  modalKey = '';
  current = 0;
  formGroup: FormGroup;
  loginMethodArr = Config.loginMethod;
  executeMethodArr = Config.loginExecute;
  /**是否显示执行时间选择框*/
  scheduledTimeCode = false;
  sub: Subscription;
  /***解析上传excel的结果*/
  parseExcelRes: ParseExcelRes;
  /**自定义表单的数据;*/
  subform;
  /**自定义表单是否通过了规则验证*/
  subformValid = false;
  /**是否批量复制*/
  isBatch = false;
  /**是否批量*/
  get isAdds() {
    return this.parentKey && (this.parentKey === 'open_copy' || this.parentKey === 'open_adds')
  }
  get isAdd() {
    return this.parentKey && (this.parentKey === 'open_add' || this.parentKey === 'open_adds')
  }
  /**任务名称是否必填*/
  get nameRequired() {
    return this.parentKey && this.parentKey === 'open_adds'
  }
  constructor(private fb: FormBuilder,
    private byVal: ByValueService,
    private hintMsg: NzMessageService) { }
  get nameValidtors() {
    return this.nameRequired ? [Validators.required] : [];
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
          this.handleOpenModal('adds_detail')
          break;
        case 'adds_success':
          this.onCancel();
          break;
        case 'parse_excel_success':
          this.parseExcelRes = res.data;
          break;
        case 'sub_form_valid':
          this.subformValid = res.data;
          break
        default:
          break;
      }
    })
    if (this.parentKey === 'open_copy' || this.parentKey === 'open_edit') {
      this.current += 1;
      this.patchValue();
    }
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

  /**批量选择参数变化*/
  batchChange(e: boolean) {
    this.isBatch = e;
  }
  /**
   * 填充form表单数据
   */
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
      if (this.parentKey === 'open_add' || this.parentKey === 'open_copy') {
        this.byVal.sendMeg({ key: 'add_start', data })
      } else if (this.parentKey === 'open_edit') {
        data.id = this.data.id;
        this.byVal.sendMeg({ key: 'eidt_start', data })
      }
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
  /**执行时间提示*/
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

  /**开始修改*/
  editStart() {
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
      this.byVal.sendMeg({ key: 'eidt_start', data: { ...data, id: this.data.id } })
    }
  }
}
