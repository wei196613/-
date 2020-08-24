import { NzMessageService } from 'ng-zorro-antd';
import { ByValueService } from 'src/app/services/by-value.service';
import { AppSpinService } from 'src/app/components/spin-mask/app-spin.service';
import { Subscription } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { DeviceList, DeviceItem, DeviceService } from 'src/app/module/components/device/device.service';
import { Account, AccountItem, DyAccountService } from 'src/app/services/dy/dy-account.service';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.less']
})
export class AddComponent implements OnInit {
  sub: Subscription;
  visible = false;
  accountData: Account; // 所有账号
  accountCheckData: AccountItem[]; // 选中的账号
  deviceData: DeviceList; // 所有设备
  deviceCheckData: DeviceItem[];// 选中设备
  deviceTotal: number
  modalKey = ''
  constructor(
    private spin: AppSpinService,
    private byVal: ByValueService,
    private device: DeviceService,
    private hintMsg: NzMessageService,
    private account: DyAccountService) { }

  ngOnInit() {
    this.sub = this.byVal.getMeg().subscribe(res => {
      switch (res.key) {
        case 'device_query':
          this.getDevicesData(res.data)
          break;
        case 'account_query':
          this.getAccountData(res.data)
          break;
        case 'device_make':
          this.deviceData = res.data;
          this.deviceCheckData = res.data.arr.filter(({ checked }) => checked);
          this.onCancel()
          break;
        case 'account_make':
          this.accountData = res.data;
          console.log(res);
          this.accountCheckData = res.data.arr.filter(({ checked }) => checked)
          this.onCancel()
          break;
      }
    })
  }
  submit() {
    this.byVal.sendMeg({ key: 'login_add', data: { devices: this.deviceCheckData.map(({ id }) => id), accounts: this.accountCheckData.map(({ id }) => id) } })
  }

  // 向服务器获取设备数据
  async getDevicesData(params = {
    perPage: 10,
    curPage: 1
  }) {
    this.spin.open('正在获取设备数据');
    try {
      const data = await this.device.getDevices(params);
      this.spin.close();
      data.arr.forEach((v) => {
      })
      this.deviceData = data;
    } catch (error) {
      this.handleError(error)
    }
  }
  // 获取账号信息
  async getAccountData(params = {
    perPage: 10,
    curPage: 1
  }) {
    this.spin.open('正在获取账号数据');
    try {
      const data = await this.account.getAccounts(params);
      this.spin.close();
      data.arr.forEach(v => v.checked = false);
      this.accountData = data
    } catch (error) {
      this.handleError(error)
    }
  }

  // 删除选中的设备
  handleDeviceDel(i: number) {
    if (this.deviceCheckData)
      this.deviceCheckData = this.deviceCheckData.filter(({ id }) => id !== i);
  }
  // 删除选中的账号
  handleAccountDel(i: number) {
    if (this.accountCheckData)
      this.accountCheckData = this.accountCheckData.filter(({ id }) => id !== i);
  }
  // 错误处理
  private handleError(error) {
    this.spin.close();
    this.hintMsg.error(error.message);
  }
  onCancel() {
    this.visible = false;
  }
  // 关闭弹框内的组件

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.sub && this.sub.unsubscribe();
  }
  handleOpenModal(s: string) {
    s === 'open_device' && this.getDevicesData();
    s === 'open_account' && this.getAccountData();
    this.visible = true;
    this.modalKey = s;
  }
}
