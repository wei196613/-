import { GetTaskTypeById, TaskItem } from 'src/app/services/my-task.service';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.less']
})
export class DetailsComponent implements OnInit {
  @Input() formConfig: GetTaskTypeById;
  @Input() data: TaskItem;
  constructor() { }

  ngOnInit() {
  }

  get parasValue() {
    if (this.data && this.data.paras) return JSON.parse(this.data.paras) as { [s: string]: any };
    return null;
  }

  /**获取select的值*/
  getSelectValue(i: number, values: string) {
    const val = JSON.parse(values) as { [s: string]: any }[];
    const v = val.find(v => v.value === i);
    return v ? v.key : '';
    const data = { "multiselect111": [1, 2], "password111": "5555", "datetime111": "2020-08-15 20:08:59", "boolean111": true, "number111": 12234, "string1111": { "spilt": "", "value": ["111", "222", "333"] }, "number11111": { "value": [1111, 2222, 3333], "randomTime": 3 }, "select111": 1, "time111": "2020-07-30 02:07:11", "string111": "dfsddfsd" }
  }
  getMultiselectValue(key: string, values: string) {
    const val = this.parasValue[key] as number[];
    return (JSON.parse(values) as { key: string, value: number }[])?.map(({ key, value }) => val.some(n => n === value) ? key : '')?.join(',')
  }
}
