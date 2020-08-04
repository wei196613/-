import { AppSpinService } from 'src/app/components/spin-mask/app-spin.service';
import { ByValueService } from 'src/app/services/by-value.service';
import { NzMessageService, NzModalService, TransferChange } from 'ng-zorro-antd';
import { Component, OnInit, Input } from '@angular/core';
import { DeviceItem, DeviceService, DeviceBinItem } from 'src/app/services/device.service';

@Component({
  selector: 'app-transfer',
  templateUrl: './transfer.component.html',
  styleUrls: ['./transfer.component.less']
})
export class TransferComponent implements OnInit {
  visible = false;
  @Input() isEdit = true;
  isimport = true;
  userId: string;
  isBinding = false;
  notBinding = true;
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
  @Input() data: DeviceBinItem;
  list: DeviceItem[] = [];
  leftTotal: number;
  rightTotal: number;
  params = {
    perPage: 10,
    curPage: 1,
    keyword: null,
    userId: null,
    mode: false,
    isBindAccount: 0
  }
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
    if (this.data && !this.isEdit) {
      this.userId = this.data.account;
      this.params.userId = this.data.id;
      this.hasParams.userId = this.data.id
      await this.getHasDevice()
      await this.getData()
      this.isimport = false
    }
  }

  async handleAccount() {
    this.spin.open("获取账号信息中")
    try {
      const data = await this.device.getUserByAccount({ account: this.userId });
      this.params.userId = data.id;
      this.hasParams.userId = data.id;
      await this.getHasDevice();
      await this.getData();
      this.isimport = false;
    } catch (error) {
      this.handleError(error)
    }
  }

  async getHasDevice(e?: string) {
    this.spin.open("获取账号已有设备")
    console.log(e);
    try {
      this.hasParams.keyword = e;
      const data = await this.device.getDevices(this.hasParams);
      this.leftTotal = data.total
      this.list = this.list.filter(({ direction }) => direction === 'right').concat(data.arr.filter(v => {
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

  handleInputChange() {
    this.list.forEach(v => {
      if (v.bindAccount === this.userId) {
        v.direction = "left"
      } else {
        v.direction = 'right'
      }
    })
    this.list = this.list.concat([])
  }

  async getData(e?: string) {
    this.spin.open('获取数据中')
    try {
      this.params.keyword = e || this.params.keyword;
      const data = await this.device.getDevices(this.params)
      this.rightTotal = data.total;
      this.list = this.list.filter(({ direction }) => direction === 'left').concat(data.arr.filter(v => {
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
      if (item.list.some(({ bindAccount }) => !!bindAccount && bindAccount !== this.userId)) {
        this.modalService.create({
          nzTitle: '警告',
          nzContent: '您要分配的设备中含有【已绑定账号】的设备，确定要进行分配吗？',
          nzClosable: false,
          nzOnOk: () => this.handleAddId(item),
          nzOnCancel: () => {
            this.list.forEach(v => {
              if (item.list.some(({ id }) => id === v.id)) {
                v.direction = 'right'
              }
            })
            this.list = [].concat(this.list)
          }
        });
      } else {
        this.handleAddId(item)
      }
    } else {
      this.handleRemoveId(item)
    }
  }

  // 添加设备
  private handleAddId(item: TransferChange) {
    this.addIds.push(...item.list.filter(({ bindAccount }) => bindAccount != this.userId).map(v => v.id))
    this.removeIds = this.removeIds.filter(v => !item.list.some(({ id }) => v === id))
    this.list = [].concat(this.list)
  }

  // 移除设备
  private handleRemoveId(item: TransferChange) {
    const changeIds = item.list.map(v => v.id);
    this.addIds = this.addIds.filter(v => !changeIds.some(i => i === v));
    this.removeIds.push(...item.list.filter(({ bindAccount }) => bindAccount === this.userId).map(v => v.id));
    this.list = [].concat(this.list)
  }

  constructor(private device: DeviceService, private spin: AppSpinService, private byVal: ByValueService, private hintMsg: NzMessageService, private modalService: NzModalService) { }
  handleError(error) {
    this.spin.close();
    // this.hintMsg.error(error.msg);
  }
  submit() {
    if (this.isimport) {
      this.handleAccount()
    } else {
      this.add()
    }
  }

  add() {
    if (this.userId === null || this.userId === undefined || this.userId === '') {
      this.hintMsg.error("请输入分配账号")
      return false
    }
    this.byVal.sendMeg({ key: 'add_start', data: { account: this.userId, addIds: this.addIds, removeIds: this.removeIds } })
  }

  onCancel() {
    this.visible = false;
  }

}
