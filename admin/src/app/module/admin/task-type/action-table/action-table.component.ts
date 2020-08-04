import { ActionTypeNames } from 'src/app/services/entity';
import { Component, OnInit, Input } from '@angular/core';
import { ByValueService } from 'src/app/services/by-value.service';

@Component({
  selector: 'app-action-table',
  templateUrl: './action-table.component.html',
  styleUrls: ['./action-table.component.less']
})
export class ActionTableComponent implements OnInit {
  /**保存数据库拉取的action*/
  @Input() actionTable: ActionTypeNames;
  params = {
    perPage: 10,
    curPage: 1,
    keyword: null
  }
  constructor(private byVal: ByValueService) { }

  ngOnInit() {
    this.getData();
  }
  getData() {
    this.byVal.sendMeg({ key: 'more_action', data: this.params })
  }
  handleTitleQuery(keyword: string) {
    this.params = {
      perPage: 10,
      curPage: 1,
      keyword
    }
    this.getData()
  }
  handleCheck(key: string) {
    this.byVal.sendMeg({ key: 'get_action_config', data: key })
  }

  handleTitleClear() {
    this.params = {
      perPage: 10,
      curPage: 1,
      keyword: null
    }
  }

}
