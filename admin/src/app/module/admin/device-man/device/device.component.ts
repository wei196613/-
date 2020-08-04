import { DeviceItem, DeviceList } from 'src/app/services/device.service';
import { Subscription } from 'rxjs';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ByValueService } from 'src/app/services/by-value.service';

@Component({
  selector: 'app-device',
  templateUrl: './device.component.html',
  styleUrls: ['./device.component.less']
})
export class DeviceComponent implements OnInit {
  @Output() idChange = new EventEmitter<DeviceItem>();
  /**保存用户信息*/
  data: DeviceList;
  sub: Subscription
  /**搜索设备信息*/
  params = {
    perPage: 10,
    curPage: 1,
    keysword: null,
    isBindAccount: 2,
    mode: false
  }
  constructor(private byVal: ByValueService) { }
  /**
   * 关键字搜索
   */
  public handleTitleQuery(s: string) {
    this.params.keysword = s;
    this.params.perPage = 10;
    this.params.curPage = 1;
    this.getData();
  }

  /**
   * 重置搜索信息
   */
  handleReset() {
    this.params.keysword = null;
    this.params.perPage = 10;
    this.params.curPage = 1;
  }
  ngOnInit() {
    this.getData();
    this.sub = this.byVal.getMeg().subscribe(res => {
      switch (res.key) {
        case 'get_device_success':
          this.data = res.data;
          break;

        default:
          break;
      }
    })
  }
  /**获取数据中*/
  getData() {
    this.byVal.sendMeg({ key: 'more_device', data: this.params })
  }
  /**选中的数据*/
  handleTdClick(data: DeviceItem) {
    this.idChange.emit(data);
  }
}
