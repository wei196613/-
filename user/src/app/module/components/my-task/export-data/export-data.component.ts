import { NzMessageService } from 'ng-zorro-antd';
import { Component, OnInit, Input } from '@angular/core';
import { GetTaskTypeById } from 'src/app/services/my-task.service';
import { Config } from 'src/app/Config';
import { ByValueService } from 'src/app/services/by-value.service';

@Component({
  selector: 'app-export-data',
  templateUrl: './export-data.component.html',
  styleUrls: ['./export-data.component.less']
})
export class ExportDataComponent implements OnInit {
  /**
   * 该类型可选字段
  */
  @Input() formConfig: GetTaskTypeById;
  /**
   * 固定可选字段
  */
  exportKeyAll: { value: string, key: number, checked: boolean }[] = Config.exportKey.reduce((pre, { key, value }) => pre.concat({ key, value, checked: false }), []);
  constructor(private byVal: ByValueService, private hintMsg: NzMessageService) { }

  ngOnInit(): void {
    this.formConfig.paras.forEach(v => v.checked = false)
  }
  /**单选按钮点击事件*/
  checkboxChange(i: string | number) {
    switch (typeof i) {
      case 'number':
        this.exportKeyAll.forEach(v => v.checked = v.key === i ? !v.checked : v.checked)
        break;
      case 'string':
        this.formConfig.paras.forEach(v => v.checked = v.name === i ? !v.checked : v.checked)
        break;
    }
  }
  /**全选按钮点击事件*/
  handleAllChange(bool: boolean) {
    this.exportKeyAll.forEach(v => v.checked = bool)
    this.formConfig.paras.forEach(v => v.checked = bool)
  }

  get getAllChecked() {
    return this.exportKeyAll.every(v => v.checked) && this.formConfig.paras.every(v => v.checked);
  }
  /**提交并检查过滤掉空数组*/
  submitForm() {
    const commonCols = this.exportKeyAll.filter(v => v.checked).map(v => v.key);
    const typeCols = this.formConfig.paras.filter(v => v.checked).map(v => v.key);
    const data = { commonCols, typeCols }
    for (const key in data) {
      if (data[key].length === 0) {
        delete data[key]
      }
    }
    this.byVal.sendMeg({ key: 'export_start', data: { data, name: this.formConfig.name } })
  }

}
