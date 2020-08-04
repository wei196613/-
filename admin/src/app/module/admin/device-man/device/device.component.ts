import { ByValueService } from 'src/app/services/by-value.service';
import { AppSpinService } from 'src/app/components/spin-mask/app-spin.service';
import { NzMessageService } from 'ng-zorro-antd';
import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { DeviceService, DeviceBin } from 'src/app/services/device.service';

@Component({
  selector: 'app-device',
  templateUrl: './device.component.html',
  styleUrls: ['./device.component.less']
})
export class DeviceComponent implements OnInit {
  visible = false;
  data: DeviceBin;
  checkData;
  modalKey = '';
  params = {
    perPage: 10,
    curPage: 1,
    keyword: null
  }
  sub: Subscription
  constructor(private device: DeviceService, private hintMsg: NzMessageService, private spin: AppSpinService, private byVal: ByValueService) { }

  async  getData() {
    this.spin.open('获取数据中')
    try {
      const data = await this.device.getUserList(this.params);
      this.data = data;
      this.spin.close();
    } catch (error) {
      this.handleError(error)
    }
  }


  async eidt(params) {
    this.spin.open('正在修改中');
    try {
      const res = await this.device.distributeDevice(params);
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
        case 'device_eidt':
          this.eidt(res.data)
        case 'add_start':
          this.add(res.data)
          break;
      }
    })
  }
  async add(params) {
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
  pageSizeChange(e) {
    this.params.perPage = e;
    this.getData();
  }
  pageIndexChange(e) {
    this.params.curPage = e;
    this.getData();
  }
  handleError(error) {
    this.spin.close();
    // this.hintMsg.error(error.msg);
  }
  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.sub && this.sub.unsubscribe();
  }
}
