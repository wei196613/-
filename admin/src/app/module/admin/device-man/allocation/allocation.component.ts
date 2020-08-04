import { DeviceItem } from 'src/app/services/device.service';
import { Component, OnInit, EventEmitter } from '@angular/core';
import { UserAccountItem } from 'src/app/components/user-account/user-account.component';

@Component({
  selector: 'app-allocation',
  templateUrl: './allocation.component.html',
  styleUrls: ['./allocation.component.less']
})
export class AllocationComponent implements OnInit {
  /**步骤条进度*/
  current = 0;
  /**分配方式选择*/
  tabIndex = null;
  /**选中的设备或用户*/
  checkedData: UserAccountItem | DeviceItem;
  constructor() { }

  ngOnInit(): void {
  }

  handleWayChange(way: number) {
    this.tabIndex = way;
    this.current += 1;
  }

  /**选中用户或选中设备事件*/
  handleUserOrDevChange(e: UserAccountItem | DeviceItem) {
    this.checkedData = e;
    this.current += 1;
  }
}
