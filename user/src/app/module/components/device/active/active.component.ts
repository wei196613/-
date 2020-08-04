import { NzMessageService } from 'ng-zorro-antd';
import { Component, OnInit } from '@angular/core';
import { ByValueService } from 'src/app/services/by-value.service';

@Component({
  selector: 'app-active',
  templateUrl: './active.component.html',
  styleUrls: ['./active.component.less']
})
export class ActiveComponent implements OnInit {
  name = null;
  constructor(private htinMsg: NzMessageService, private byVal: ByValueService) { }

  ngOnInit(): void {
  }

  submit() {
    if (this.name == null || this.name == undefined || this.name == '') {
      return this.htinMsg.error('请输入激活码')
    }
    this.byVal.sendMeg({ key: 'active_start', data: this.name })
  }
}
