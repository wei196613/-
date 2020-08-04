import { NzMessageService } from 'ng-zorro-antd';
import { ByValueService } from 'src/app/services/by-value.service';
import { BonuserUrlItem } from 'src/app/services/jd/pullNew.service';
import { Component, OnInit, Input } from '@angular/core';
import { Config } from 'src/app/Config';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.less']
})
export class EditComponent implements OnInit {
  @Input() data: BonuserUrlItem;
  maximum: number;
  tpe = 1;
  radioAll = Config.pullNewTpe;
  constructor(private byVal: ByValueService, private hintMsg: NzMessageService) { }

  ngOnInit() {
    this.maximum = this.data.maximum;
    this.tpe = this.data.tpe;
  }
  edit() {
    if (this.maximum < 0) {
      this.hintMsg.error('每日可用次数不能小于0');
      return;
    }
    this.byVal.sendMeg({ key: 'EDIT_START', data: { id: this.data.id, maximum: this.maximum, tpe: this.tpe } })
  }
}
