import { AppSpinService } from 'src/app/components/spin-mask/app-spin.service';
import { ByValueService } from 'src/app/services/by-value.service';
import { NzMessageService, TransferChange } from 'ng-zorro-antd';
import { Component, OnInit, Input } from '@angular/core';
import { DeviceItem, DeviceService, DeviceBinItem, AccountsBindDevicesItem, BindAccountsOfDevice, AccountsBindDevices, DeviceList, BindAccountsOfDeviceItem } from 'src/app/services/device.service';
import { UserAccountItem } from 'src/app/components/user-account/user-account.component';

@Component({
  selector: 'app-transfer',
  templateUrl: './transfer.component.html',
  styleUrls: ['./transfer.component.less']
})
export class TransferComponent implements OnInit {
  /**是否打开对话框*/
  visible = false;
  @Input() tabIndex: number;
  /**更多设备*/
  deviceData: { id: number, name: string }[];
  menuItem = [
    {
      id: 0, name: '未绑定设备',
    }, {
      id: 1, name: '已绑定设备',
    }, {
      id: 2, name: '全部',
    }
  ]

  get menuTitle() {
    return this.menuItem.find(({ id }) => id === this.params.isBindAccount).name;
  }
  /**要操作设备信息 | 用户信息*/
  @Input() data: DeviceBinItem | AccountsBindDevicesItem;
  list: (DeviceItem | AccountsBindDevicesItem)[] = [];
  /**数据库记录的已选总数*/
  leftTotal: number;
  /**可以绑定的总数*/
  rightTotal: number;
  /**可选设备 | 用户的搜索参数*/
  params = {
    perPage: 10,
    curPage: 1,
    keyword: null,
    userId: null,
    mode: false,
    isBindAccount: 0
  }
  /**已绑设备 | 用户的搜索参数*/
  hasParams = {
    perPage: 10,
    curPage: 1,
    keyword: null,
    userId: null,
    mode: true
  }
  addIds: number[] = [];
  removeIds: number[] = [];

  handleMenuClick(i: number) {
    if (i !== this.params.isBindAccount) {
      this.params.curPage = 1;
      this.params.isBindAccount = i;
      this.getData();
    }
  }

  async ngOnInit() {
    this.params.userId = this.data.id;
    this.hasParams.userId = this.data.id
    await this.getHasDevice()
    await this.getData()
  }
  /**已绑关键字查询*/
  handleHasTitleQuery(e?: string) {
    this.hasParams.curPage = 1;
    this.hasParams.perPage = 10;
    this.hasParams.keyword = e?.length > 0 ? e : null;
    this.getHasDevice()
  }
  /**获取已绑定设备 | 用户*/
  async getHasDevice() {
    this.spin.open("获取账号已有设备")
    try {
      let data: BindAccountsOfDevice | DeviceList = null;
      if (this.tabIndex === 0) {
        data = await this.device.getDevices(this.hasParams);
      } else {
        data = await this.device.getBindAccountsOfDevice({ perPage: this.hasParams.perPage, curPage: this.hasParams.curPage, keyword: this.hasParams.keyword, deviceId: this.data.id, })
      }
      this.leftTotal = data.total
      this.list = (this.list as DeviceItem[]).filter(({ direction }) => direction === 'right').concat((data?.arr as DeviceItem[])?.filter(v => {
        v.checked = false;
        v.direction = "left"
        if (this.removeIds.some(i => i === v.id)) return false;
        return true;
      }))
      this.spin.close();
    } catch (error) {
      this.handleError(error)
    }
  }
  /**未绑关键字查询*/
  handleTitleQuery(e?: string) {
    this.params.curPage = 1;
    this.hasParams.perPage = 10;
    this.params.keyword = e?.length > 0 ? e : null;
    this.getData()
  }
  /**获取未绑用户 | 设备*/
  async getData() {
    this.spin.open('获取数据中')
    try {
      let data: BindAccountsOfDevice | DeviceList = null;
      if (this.tabIndex === 0) {
        data = await this.device.getDevices(this.params)
      } else {
        data = await this.device.getBindAccountsOfDevice({ perPage: this.params.perPage, curPage: this.params.curPage, keyword: this.params.keyword, deviceId: this.data.id, mode: false })
      }
      this.rightTotal = data.total;
      this.list = (this.list as DeviceItem[]).filter(({ direction }) => direction === 'left');
      this.list = (this.list as DeviceItem[]).concat((data?.arr as DeviceItem[])?.filter(v => {
        v.checked = false;
        v.direction = "right"
        if (this.addIds.some(i => i === v.id)) {
          return false
        }
        return true
      }))
      this.spin.close();
    } catch (error) {
      this.handleError(error)
    }
  }

  change(item: TransferChange) {
    if (item.from === 'right' && item.to === 'left') {
      this.handleAddId(item)
    } else {
      this.handleRemoveId(item)
    }
  }

  /**添加*/
  private handleAddId(item: TransferChange) {
    this.addIds.push(...item.list.filter(v => {
      if (this.tabIndex === 0) {
        return !v.bindAccounts?.some(i => i.account === this.data.account)
      } else {
        return !v.devices?.some(i => i.name === this.data.deviceName)
      }
    }).map(v => v.id))
    this.removeIds = this.removeIds.filter(v => !item.list.some(({ id }) => v === id))
    this.list = [].concat(this.list)
  }

  /**移除*/
  private handleRemoveId(item: TransferChange) {
    const changeIds = item.list.map(v => v.id);
    this.addIds = this.addIds.filter(v => !changeIds.some(i => i === v));
    this.removeIds.push(...item.list.filter(v => {
      if (this.tabIndex === 0) {
        return v.bindAccounts?.some(i => i.account === this.data.account)
      } else {
        return v.devices?.some(i => i.name === this.data.deviceName)
      }
    }).map(v => v.id));
    this.list = [].concat(this.list)
  }

  constructor(private device: DeviceService, private spin: AppSpinService, private byVal: ByValueService, private hintMsg: NzMessageService) { }
  handleError(error) {
    this.spin.close();
  }
  /**提交*/
  submit() {
    if (this.removeIds.length === 0 && this.addIds.length === 0) {
      return this.byVal.sendMeg({ key: 'colse_modal' })
    }
    if (this.tabIndex === 0) {
      this.byVal.sendMeg({ key: 'transfer_device', data: { account: this.data.account, addIds: this.addIds, removeIds: this.removeIds } })
    } else {
      this.byVal.sendMeg({ key: 'transfer_user', data: { deviceId: this.data.id, addIds: this.addIds, removeIds: this.removeIds } })
    }
  }
  /**关闭弹框*/
  onCancel() {
    this.visible = !this.visible;
  }
  /**穿梭框转移*/
  handleTransfer(data: DeviceItem | AccountsBindDevicesItem) {
    data.direction = data.direction === 'left' ? 'right' : 'left';
    data.direction === 'right' ? this.handleRemoveId({ from: 'left', to: 'right', list: [data] }) : this.handleAddId({ from: 'right', to: 'left', list: [data] });
    this.list = [...this.list];
  }
  /**打开对话框*/
  handleOpenModal(data: AccountsBindDevicesItem) {
    console.log(data.devices);
    
    this.deviceData = data.devices;
    this.onCancel();
  }
}
