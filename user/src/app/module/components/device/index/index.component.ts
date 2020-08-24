import { UserInfoService } from 'src/app/services/userInfo.service';
import { ByValueService } from 'src/app/services/by-value.service';
import { AppSpinService } from 'src/app/components/spin-mask/app-spin.service';
import { NzMessageService } from 'ng-zorro-antd';
import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { DeviceService, DeviceList, DeviceItem } from '../device.service';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.less']
})
export class IndexComponent implements OnInit {
  modalKey = ''
  visible = false;
  data: DeviceList;
  checkData: DeviceItem;
  params = {
    perPage: 10,
    curPage: 1,
    keyword: null,
    userId: this.user.userInfo.id,
    mode: true
  }
  sub: Subscription
  constructor(private user: UserInfoService, private device: DeviceService, private hintMsg: NzMessageService, private spin: AppSpinService, private byVal: ByValueService) { }
  // 获取数据
  async getData() {
    this.spin.open('获取数据中')
    try {
      const data = await this.device.getDevices(this.params);
      this.data = data;
      this.spin.close();
      this.onCancel();
    } catch (error) {
      this.handleError(error)
    }
  }
  // 修改设备数据
  async eidt(params) {
    this.spin.open('正在修改中');
    try {
      const res = await this.device.editDevice(params)
      await this.getData();
      this.hintMsg.success(res.msg)
      this.onCancel();
    } catch (error) {
      this.handleError(error)
    }
  }
  // 转移设备
  async distributeDevice(params) {
    try {
      const res = await this.device.distributeDevice(params)
      await this.getData();
      this.onCancel();
      this.hintMsg.success(res.msg)
    } catch (error) {
      this.handleError(error)
    }
  }
  /**激活设备*/
  private async useActivationCode(code: string) {
    this.spin.open('激活中。。。')
    try {
      const res = await this.device.useActivationCode({ deviceId: this.checkData.id, code })
      await this.getData();
      this.onCancel();
      this.hintMsg.success(res.msg)
    } catch (error) {
      this.handleError(error)
    }
  }
  ngOnInit() {
    this.getData();
    this.sub = this.byVal.getMeg().subscribe(res => {
      switch (res.key) {
        case 'device_eidt':
          this.eidt(res.data)
          break;
        case 'transfer_start':
          this.distributeDevice(res.data)
          break;
        case 'active_start':
          this.useActivationCode(res.data)
          break;
      }
    })
  }

  handleQuery(msg: string) {
    this.params = {
      perPage: 10,
      curPage: 1,
      keyword: msg,
      userId: this.user.userInfo.id,
      mode: true
    }
    this.getData();
  }

  handleReset() {
    this.params = {
      perPage: 10,
      curPage: 1,
      keyword: null,
      userId: this.user.userInfo.id,
      mode: true
    }
  }

  handleOpenModal(key, data?) {
    if (data) {
      this.checkData = data;
    }
    this.modalKey = key;
    this.visible = true;
  }
  onCancel() {
    this.visible = false;
  }
  pageSizeChange(e) {
    this.params.perPage = e;
    this.getData();
  }
  pageIndexChange(e) {
    this.params.curPage = e;
    this.getData();
  }
  private handleError(error) {
    this.spin.close();
    this.hintMsg.error(error.message);
  }
  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.sub && this.sub.unsubscribe();
  }
  /**获取有效期*/
  getTimeRemaining(time: number): string {
    if (time > 0) {
      let s = '';
      let n = Math.floor(time / 60 / 60 / 24);
      if (n > 0) {
        s += (n + '天')
      } else {
        s += '0天'
      }
      time = time % (60 * 60 * 24);
      let h = Math.floor(time / 60 / 60);
      if (h > 0) {
        s += (h + '时')
      } else {
        s += '0时'
      }
      time = time % (60 * 60);
      let m = Math.floor(time / 60);
      if (m > 0) {
        s += (m + '分')
      } else {
        s += '0分'
      }
      time = time % 60;
      s += (time + '秒')
      return s;
    }
    return '';
  }
}
