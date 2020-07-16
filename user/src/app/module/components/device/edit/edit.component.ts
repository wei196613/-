import { ByValueService } from 'src/app/services/by-value.service';
import { Component, OnInit, Input } from '@angular/core';
import { DeviceItem } from '../device.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.less']
})
export class EditComponent implements OnInit {

  @Input() data: DeviceItem;
  name: string;
  constructor(private byVal: ByValueService) { }

  ngOnInit() {
    this.name = this.data.name;
  }

  eidt() {
    if (this.name === null || this.name === undefined || this.name === '') {
      return false;
    }
    this.byVal.sendMeg({ key: 'device_eidt', data: { id: this.data.id, name: this.name } })
  }
}
