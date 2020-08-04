
import { ByValueService } from 'src/app/services/by-value.service';
import { AppSpinService } from 'src/app/components/spin-mask/app-spin.service';
import { NzMessageService } from 'ng-zorro-antd';
import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { DeviceService, DeviceBin, AccountsBindDevices } from 'src/app/services/device.service';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.less']
})
export class IndexComponent implements OnInit {
  /**当前激活标签页的下标*/
  tabIndex = 0;
  /**控制对话框*/
  visible = false;
  /**展示数据*/
  data: DeviceBin | AccountsBindDevices;
  /**选中要修改的数据*/
  checkData;
  /**控制打开对话框内容*/
  modalKey = '';
  /**查询数据条件*/
  params = {
    perPage: 10,
    curPage: 1,
    keyword: null
  }
  sub: Subscription
  constructor(private device: DeviceService, private hintMsg: NzMessageService, private spin: AppSpinService, private byVal: ByValueService) { }
  /**从服务器端拉取数据*/
  async getData() {
    this.spin.open('获取数据中')
    try {
      let data: DeviceBin | AccountsBindDevices = null;
      if (this.tabIndex === 0) {
        data = await this.device.getDevicesBindAccounts(this.params);
      } else if (this.tabIndex === 1) {
        data = await this.device.getAccountsBindDevices(this.params);
      }
      this.data = data;
      this.spin.close();
    } catch (error) {
      this.data = null;
      this.handleError(error)
    }
  }


  async distributeDevice2Users(params) {
    this.spin.open('正在修改中');
    try {
      const res = await this.device.distributeDevice2Users(params);
      await this.getData()
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
        case 'title_query':
          if (!this.visible) {
            this.params.keyword = res.data.msg;
            this.getData();
          }
          break;
        case 'title_clear':
          this.params.keyword = null;
          break;
        case 'more_device':
          this.getDevice(res.data);
          break;
        case 'colse_modal':
          this.onCancel();
          break;
        case 'transfer_user':
          this.distributeDevice2Users(res.data)
          break;
        case 'transfer_device':
          this.distributeDevice(res.data)
          break;
      }
    })
  }
  async distributeDevice(params) {
    try {
      const res = await this.device.distributeDevice(params);
      await this.getData()
      this.onCancel()
      this.hintMsg.success(res.msg)
    } catch (error) {
      this.handleError(error)
    }
  }

  handleOpenModal(key: string, data?) {
    this.modalKey = key
    this.checkData = data;
    this.visible = true;
  }
  onCancel() {
    this.visible = false;
    const timer = setTimeout(() => {
      this.modalKey = '';
      clearTimeout(timer);
    }, 100);
  }

  /**错误处理*/
  handleError(error) {
    this.spin.close();
    // this.hintMsg.error(error.msg);
  }
  ngOnDestroy(): void {
    /**取消监听*/
    this.sub && this.sub.unsubscribe();
  }
  /**标签页发生变化*/
  handleTabChange() {
    this.params.curPage = 1;
    this.getData();
  }
  /**获取设备*/
  private async getDevice(params) {
    this.spin.open('获取设备中');
    try {
      const data = await this.device.getDevices(params);
      this.byVal.sendMeg({ key: 'get_device_success', data });
      this.spin.close();
    } catch (error) {
      this.handleError(error);
    }
  }
}
