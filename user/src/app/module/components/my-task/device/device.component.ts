import { Subscription } from 'rxjs';
import { DeviceItem } from 'src/app/module/components/device/device.service';
import { Component, OnInit, Input } from '@angular/core';
import { ByValueService } from 'src/app/services/by-value.service';
import { TransferChange, TransferItem } from 'ng-zorro-antd';

@Component({
  selector: 'app-device',
  templateUrl: './device.component.html',
  styleUrls: ['./device.component.less']
})
export class DeviceComponent implements OnInit {
  @Input() device: DeviceItem[];
  rightTotal: number;
  params = {
    perPage: 10,
    curPage: 1,
    keyword: null
  }
  sub: Subscription
  list: DeviceItem[] = [];
  constructor(private byVal: ByValueService) { }

  ngOnInit(): void {
    if (this.device) {
      this.device.forEach(v => v.direction = 'left')
      this.list.push(...this.device);
    }
    this.sub = this.byVal.getMeg().subscribe(res => {
      if (res.key === 'get_device_success') {
        const list = this.list.filter(v => v.direction === 'left');
        this.rightTotal = res.data.total
        let rightList: DeviceItem[] = res.data.arr;
        rightList = rightList.filter(v => {
          v.direction = 'right';
          v.title = v.name;
          return !list.some(s => {
            // this.rightTotal -= 1;
            return s.id === v.id
          })
        });
        this.list = list.concat(...rightList);
      }
    })
    this.getData();
  }

  getData() {
    this.byVal.sendMeg({ key: 'more_device', data: this.params });
  }

  handleQuery(keyword: string) {
    this.params = {
      perPage: 10,
      curPage: 1,
      keyword
    }
    this.getData()
  }

  handleReset() {
    this.params = {
      perPage: 10,
      curPage: 1,
      keyword: null
    }
  }

  change(item: TransferChange) {
    this.list = [].concat(...this.list)
  }

  submit() {
    const data = this.list.filter(({ direction }) => direction === 'left');
    this.byVal.sendMeg({ key: 'select_deivce_end', data })
  }
  ngOnDestroy(): void {
    this.sub && this.sub.unsubscribe();
  }
  handleTdClick(data: DeviceItem) {
    data.checked = false;
    data.direction = data.direction === 'left' ? 'right' : 'left';
    this.list = [].concat(...this.list)
  }
}
