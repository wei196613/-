import { Component, OnInit, Input } from '@angular/core';
import { ByValueService } from 'src/app/services/by-value.service';
import { AccountExcel } from 'src/app/services/dy/dy-account.service';

@Component({
  selector: 'app-adds',
  templateUrl: './adds.component.html',
  styleUrls: ['./adds.component.less']
})
export class AddsComponent implements OnInit {
  @Input() data: AccountExcel;
  constructor(private byVal: ByValueService) { }

  ngOnInit() {
  }

  handleAdds() {
    this.byVal.sendMeg({ key: 'adds_start' })
  }

}
