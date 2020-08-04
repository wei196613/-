import { NzMessageService } from 'ng-zorro-antd';
import { TaskTypes, TaskTypeItem } from 'src/app/services/entity';
import { Subscription } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { ByValueService } from 'src/app/services/by-value.service';

@Component({
  selector: 'app-batch-edit',
  templateUrl: './batch-edit.component.html',
  styleUrls: ['./batch-edit.component.less']
})
export class BatchEditComponent implements OnInit {
  data: TaskTypes;
  /**任务进度*/
  current = 1;
  /**要修改的任务ID*/
  editTask: { id: number, name: string }[] = [];
  /**不可见任务ID*/
  unvisibleIds: number[] = [];
  /**可见任务ID*/
  visibleIds: number[] = [];
  sub: Subscription
  params = {
    perPage: 30,
    curPage: 1,
    keyword: null
  }
  constructor(private byVal: ByValueService, private hintMsg: NzMessageService) { }

  ngOnInit(): void {
    this.sub = this.byVal.getMeg().subscribe(res => {
      if (res.key === 'get_task_type_success') {
        this.data = res.data
      }
    })
    this.getData();
  }
  submit() {
    this.byVal.sendMeg({ key: 'edits_start', data: { unvisibleIds: this.unvisibleIds, visibleIds: this.visibleIds } })
  }
  handleNext() {
    if (this.editTask.length < 1) {
      return this.hintMsg.error('至少选中一个任务，才能修改')
    }
    this.current += 1;
    this.unvisibleIds = this.editTask.map(({ id }) => id);
    this.visibleIds = [];
  }
  handlePre() {
    this.current -= 1;
  }
  getData() {
    this.byVal.sendMeg({ key: 'get_task_type', data: { ...this.params } })
  }
  /**查询按钮点击事件*/
  handleQuery(keyword) {
    this.params.curPage = 1;
    this.params.perPage = 30;
    this.params.keyword = keyword;
    this.getData()
  }
  /**重置按钮点击事件*/
  handleReset() {
    this.params = {
      perPage: 30,
      curPage: 1,
      keyword: null
    }
  }
  /**判断改按钮是否选中*/
  handleGetClass(id) {
    return this.editTask?.some(v => v.id === id) ? 'ant-btn-success' : null;
  }
  /**修改任务的选中变化*/
  handleEditTaskchange(item: TaskTypeItem) {
    const v = this.editTask.findIndex(i => i.id === item.id);
    v > -1 ? this.editTask.splice(v, 1) : this.editTask.push({ id: item.id, name: item.name });
  }
  /**选中变化*/
  handleLabelChange(id: number) {
    let bool = this.visibleIds.some(v => v === id);
    console.log('测试1323424');
    if (bool) {
      let index = this.visibleIds.findIndex(v => v === id);
      this.visibleIds.splice(index, 1);
      this.unvisibleIds.push(id);
    } else {
      let index = this.unvisibleIds.findIndex(v => v === id);
      this.unvisibleIds.splice(index, 1);
      this.visibleIds.push(id);
    }
  }
}
