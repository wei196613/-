import { Subscription } from 'rxjs';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ByValueService } from 'src/app/services/by-value.service';
import { RolesList } from 'src/app/services/entity';

@Component({
  selector: 'app-task-copy',
  templateUrl: './task-copy.component.html',
  styleUrls: ['./task-copy.component.less']
})
export class TaskCopyComponent implements OnInit {
  sub: Subscription;
  /**保存任务信息*/
  data: RolesList;
  /**搜索任务信息*/
  params = {
    perPage: 10,
    curPage: 1,
    keysword: null
  }
  constructor(private byVal: ByValueService) { }

  ngOnInit() {
    this.sub = this.byVal.getMeg().subscribe(res => {
      if (res.key === 'more_role_select_success') {
        this.data = res.data;
      }
    })
    this.getData()
  }

  /**
   * 关键字搜索
   */
  public handleTitleQuery(s: string) {
    this.params.keysword = s;
    this.params.perPage = 10;
    this.params.curPage = 1;
    this.getData();
  }

  /**
   * 重置搜索信息
   */
  handleReset() {
    this.params = {
      perPage: 10,
      curPage: 1,
      keysword: null
    }
  }
  handleTdClick(id: number) {
    this.byVal.sendMeg({ key: 'get_role_details', data: { roleId: id, perPage: 30, curPage: 1 } })
  }
  getData() {
    this.byVal.sendMeg({ key: 'more_role_select', data: this.params });
  }
}
