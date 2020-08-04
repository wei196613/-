import { format } from 'date-fns';
import { DeviceItem } from 'src/app/module/components/device/device.service';
import { Component, OnInit, Input } from '@angular/core';
import { ParseExcelRes, TaskAddsParams } from 'src/app/services/my-task.service';
import { ByValueService } from 'src/app/services/by-value.service';

@Component({
  selector: 'app-adds-detail',
  templateUrl: './adds-detail.component.html',
  styleUrls: ['./adds-detail.component.less']
})
export class AddsDetailComponent implements OnInit {
  @Input() data: ParseExcelRes;
  @Input() device: DeviceItem[];
  @Input() subform: Subform;
  @Input() params;
  @Input() taskTypeName: string;
  modalKey = '';
  visible = false;
  tableData: string[][];


  constructor(private byVal: ByValueService) { }

  ngOnInit(): void {
    console.log(this.subform);
    if (this.data && this.data.arr) {
      this.tableData = this.data.arr.map(v => JSON.parse(v));
    }
    console.log(this.subform);
  }
  submitForm() {
    const data = this.getParams()
    this.byVal.sendMeg({ key: 'adds_start', data });
  }
  private getParams() {
    const params: TaskAddsParams = {
      taskTypeId: null,
      name: null,
      bindDeviceIds: null,
      executeMethod: null,//1-立即执行，2-手动执行，3-计划执行
      scheduledTime: null,//选了计划执行才要填计划执行时间
      consistentParas: null, // 格式如下
      difParas: null,// 参数的key名
      excelKey: null
    };
    params.bindDeviceIds = this.device.map(v => v.id);
    params.excelKey = this.data.key;
    params.executeMethod = this.params.executeMethod;
    if (this.params.executeMethod === 3) {
      params.scheduledTime = format(this.params.scheduledTime, 'yyyy-MM-dd HH:mm:ss');
    }
    params.taskTypeId = this.params.taskTypeId;
    params.name = this.params.name;
    params.difParas = this.subform.paramsName.map(({ key, tpe }) => tpe === 6 ? { key, spilt: this.subform.subParams.find(v => v.key === key)?.spilt } : { key });
    params.consistentParas = JSON.stringify(this.subform.subParams.filter(v => !this.subform.paramsName.some(i => v.key === i.key)));
    for (const key in params) {
      if (params[key] === null || params[key] === undefined || params[key] === '') {
        delete params[key];
      }
    }
    return params;
  }
  onCancel() {
    this.visible = false;
    const timer = setTimeout(() => {
      this.modalKey = '';
      clearTimeout(timer);
    }, 100);
  }

  handleOpenModal(key: string) {
    this.modalKey = key;
    this.visible = true;
  }
  getParaName(key: string) {
    if (key) {
      const v = this.subform.subParams.find(i => i.key == key);
      return v
    }
  }
}

interface Subform {
  subParams: { [s: string]: any }[],
  paramsName: { key: string, name: string, spilt?: string, tpe: number }[],
  difParamsName: { key: string, name: string, tpe: number }[]
}