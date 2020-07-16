import { ByValueService } from 'src/app/services/by-value.service';
import { Component, OnInit, Input } from '@angular/core';
import { DeviceBinItem } from 'src/app/services/device.service';

@Component({
  selector: 'app-eidt',
  templateUrl: './eidt.component.html',
  styleUrls: ['./eidt.component.less']
})
export class EidtComponent implements OnInit {
  @Input() data: DeviceBinItem
  constructor(private byVal: ByValueService) { }

  ngOnInit() {
  }

  eidt() {

  }
}
