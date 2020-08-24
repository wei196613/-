import { UserInfoService } from 'src/app/services/userInfo.service';
import { AppSpinService } from 'src/app/components/spin-mask/app-spin.service';
import { ByValueService } from 'src/app/services/by-value.service';
import { NzMessageService } from 'ng-zorro-antd';
import { Component, OnInit, Input } from '@angular/core';
import { DeviceItem, DeviceService, DeviceBinItem, DeviceList } from '../device.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-transfer',
  templateUrl: './transfer.component.html',
  styleUrls: ['./transfer.component.less']
})
export class TransferComponent implements OnInit {
  userId: string;
  list: DeviceList = { arr: [], total: null };
  total: number;
  deviceIds: number[] = [];
  sub: Subscription
  params = {
    perPage: 10,
    curPage: 1,
    keyword: null,
    userId: this.user.userInfo.id,
    mode: true
  }

  ngOnInit(): void {
    this.getData();
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

  async getData() {
    this.spin.open('获取数据中')
    try {
      const data = await this.device.getDevices(this.params)
      data.arr.forEach(v => v.checked = this.deviceIds.some(i => i === v.id));
      this.list = data;
      this.spin.close();
    } catch (error) {
      this.handleError(error)
    }
  }

  get checkedAll() {
    if (this.list.arr.length === 0) {
      return false
    }
    return this.list.arr.every(({ checked }) => checked === true)
  }

  get isIndeterminate() {
    return this.list.arr.some(({ checked }) => checked === true) && !this.checkedAll
  }

  checkAll(e) {
    this.list.arr.forEach(v => {
      v.checked = e;
      if (e) {
        this.deviceIds.push(v.id)
      } else {
        this.deviceIds = this.deviceIds.filter(i => i !== v.id)
      }
    })
  }

  refreshStatus(e: boolean, v: number) {
    this.list.arr[v].checked = e;
    if (e) {
      this.deviceIds.push(this.list.arr[v].id)
    } else {
      this.deviceIds.splice(this.deviceIds.findIndex(i => i === this.list.arr[v].id), 1)
    }
  }

  handleIndexChange(e) {
    this.params.perPage = e;
    this.getData();
  }

  constructor(private user: UserInfoService, private device: DeviceService, private spin: AppSpinService, private byVal: ByValueService, private hintMsg: NzMessageService) { }
  private handleError(error) {
    this.spin.close();
    this.hintMsg.error(error.message);
  }
  add() {
    if (this.userId === null || this.userId === undefined || this.userId === '') {
      this.hintMsg.error("请输入分配账号")
      return false
    }
    if (this.deviceIds && this.deviceIds.length < 1) {
      this.hintMsg.error("最少选择一个设备")
      return false
    }
    this.byVal.sendMeg({ key: 'transfer_start', data: { account: this.userId, deviceIds: this.deviceIds } })
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.sub && this.sub.unsubscribe()
  }
}
