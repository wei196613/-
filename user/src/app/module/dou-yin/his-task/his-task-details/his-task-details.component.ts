import { ByValueService } from 'src/app/services/by-value.service';
import { LoginTaskHisDetail } from 'src/app/services/dy/dy-his-task.service';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-his-task-details',
  templateUrl: './his-task-details.component.html',
  styleUrls: ['./his-task-details.component.less']
})
export class HisTaskDetailsComponent implements OnInit {
  @Input() data;
  @Input() tabIndex: number;
  @Input() tableData: LoginTaskHisDetail;
  @Output() loginTaskMore = new EventEmitter<number>();
  constructor(private byVal: ByValueService) { }

  ngOnInit() {
  }
  handleIndexChange(e: number) {
    this.loginTaskMore.emit(e);
  }

  handleGetAccount(byAccount: { id: number, account?: string, weibo?: string }) {
    switch (true) {
      case !byAccount:
        return ''
        break;
      case !!byAccount.weibo:
        return `(微博)${byAccount.weibo}`
        break;

    }
  }
}
