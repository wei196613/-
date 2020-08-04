import { Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd';
import { ByValueService } from 'src/app/services/by-value.service';
import { Config } from 'src/app/Config';
@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.less']
})
export class AddComponent implements OnInit {
  inputValue: string;
  maximum = 1;
  tpe = 1;
  radioAll = Config.pullNewTpe;
  constructor(private byVal: ByValueService, private hintMsg: NzMessageService) { }

  ngOnInit() {
  }
  add() {
    if (this.inputValue === null || this.inputValue === undefined || this.inputValue === '') {
      return;
    }
    if (this.maximum < 0) {
      this.hintMsg.error('每日可用次数不能小于0');
      return;
    }
    this.byVal.sendMeg({ key: 'ADD_START', data: { urls: this.inputValue.split('\n').join(';'), maximum: this.maximum, tpe: this.tpe } })
  }
}
