import { Subscription } from 'rxjs';
import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { ByValueService } from 'src/app/services/by-value.service';
import { DeviceList } from 'src/app/module/components/device/device.service';

@Component({
  selector: 'app-device',
  templateUrl: './device.component.html',
  styleUrls: ['./device.component.less']
})
export class DeviceComponent implements OnInit {
  @Input() data: DeviceList;
  sub: Subscription;
  params = {
    perPage: 10,
    curPage: 1,
    keyword: null
  }
  constructor(private byVal: ByValueService) { }
  ngOnInit() {
  }

  handleQuery(keyword: string) {
    this.params = {
      perPage: 10,
      curPage: 1,
      keyword
    }
    this.byVal.sendMeg({ key: 'device_query', data: this.params })
  }
  handleReset() {
    this.params = {
      perPage: 10,
      curPage: 1,
      keyword: null
    }
  }

  handleMake() {
    this.byVal.sendMeg({ key: 'device_make', data: this.data })
  }
  tableCheckAll(e: boolean) {
    this.data.arr.forEach(v => v.checked = e)
  }
  handleCheck(e: boolean, i: number) {
    this.data[i].checked = e;
  }
  get allChecked() {
    if (!this.data) return false;
    return this.data.arr.every(({ checked }) => checked === true);
  }
  get indeterminate() {
    if (!this.data) return false;
    return this.data.arr.some(({ checked }) => checked === true) && !this.allChecked;
  }
  ngOnDestroy(): void {
    this.sub && this.sub.unsubscribe();
  }
  pageIndexChange(e: number) {
    this.params.curPage = e;
    this.byVal.sendMeg({ key: 'device_query', data: this.params })
  }
}
