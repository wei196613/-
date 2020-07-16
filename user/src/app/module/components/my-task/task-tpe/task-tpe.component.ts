import { ByValueService } from 'src/app/services/by-value.service';
import { Component, OnInit, Input } from '@angular/core';
import { TaskTypeNames, TaskTypeNameItem } from 'src/app/services/my-task.service';

@Component({
  selector: 'app-task-tpe',
  templateUrl: './task-tpe.component.html',
  styleUrls: ['./task-tpe.component.less']
})
export class TaskTpeComponent implements OnInit {
  @Input() taskTypeTable: TaskTypeNames;
  params = {
    perPage: 10,
    curPage: 1,
    keyword: null
  }
  handleQuery(keyword: string) {
    this.params = {
      perPage: 10,
      curPage: 1,
      keyword
    }
    this.byVal.sendMeg({ key: 'get_task_type', data: this.params })
  }
  handleReset() {
    this.params = {
      perPage: 10,
      curPage: 1,
      keyword: null
    }
  }
  constructor(private byVal: ByValueService) { }

  ngOnInit(): void {

  }
  pageIndexChange(e) {
    this.params.curPage = e;
    this.byVal.sendMeg({ key: 'get_task_type', data: this.params })
  }
  pageSizeChange(e) {
    this.params.perPage = e;
    this.byVal.sendMeg({ key: 'get_task_type', data: this.params })
  }
  handleTdClick(data: TaskTypeNameItem) {
    this.byVal.sendMeg({ key: 'task_tpe_checked', data })
  }

}
