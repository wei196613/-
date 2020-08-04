import { ByValueService } from 'src/app/services/by-value.service';

import { NzMessageService } from 'ng-zorro-antd';
import { AdminService } from 'src/app/services/admin.service';
import { AppSpinService } from 'src/app/components/spin-mask/app-spin.service';
import { Component, OnInit } from '@angular/core';
import { TaskList, TaskItem, TaskDetail } from 'src/app/services/entity';
import { format } from "date-fns";
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.less']
})
export class TaskComponent implements OnInit {
  visible = false;
  taskLogVisible = false;
  taskLogMsg: string[];
  selectAll = [
    {
      name: 'selestFirst', arr: [
        { value: 0, label: '未完成' },
        { value: 1, label: '成功' },
        { value: 2, label: '失败' }
      ],
      placeholder: '任务结果'
    }
  ]
  params = {
    perPage: 10,
    curPage: 1,
    account: null,
    result: null,
    start: null,
    end: null,
  }
  data: TaskList;
  checkData: TaskItem;
  taskDetail: TaskDetail;
  sub: Subscription
  constructor(private byVal: ByValueService, private spin: AppSpinService, private admin: AdminService, private hintMsg: NzMessageService) { }

  ngOnInit() {
    this.sub = this.byVal.getMeg().subscribe(res => {
      switch (res.key) {
        case 'title_query':
          this.titleQuery(res.data)
          break;
      }

    })
    this.getData();
  }

  titleQuery(data) {
    this.params.perPage = 10;
    this.params.curPage = 1;
    this.params.account = data.msg;
    this.params.result = data.selestFirst;
    if (data.date && data.date.length === 2) {
      this.params.start = format(data.date[0], 'yyyy-MM-dd') + ' 00:00:00';
      this.params.end = format(data.date[1], 'yyyy-MM-dd') + ' 23:59:59';
    } else {
      this.params.start = null;
      this.params.end = null;
    }
    this.getData();
  }

  // 向服务器获取 数据
  async getData() {
    this.spin.open('正在获取数据');
    try {
      const data = await this.admin.getTaskList(this.params);
      this.data = data;
      this.spin.close()
    } catch (error) {
      this.handleError(error)
    }
  }

  async handleOpenModal(data: TaskItem) {
    this.checkData = data;
    this.spin.open('正在获取数据');
    try {
      const res = await this.admin.taskDetail(data.id);
      this.visible = true;
      this.taskDetail = res;
      this.spin.close()
    } catch (error) {
      this.handleError(error)
    }
  }

  async taskLog() {
    this.spin.open('正在获取数据');
    try {
      const res = await this.admin.taskLog(this.checkData.id);
      this.taskLogVisible = true;
      this.taskLogMsg = res;
      this.spin.close();
    } catch (error) {
      this.handleError(error)
    }
  }

  taskOnCancel() {
    this.taskLogVisible = false;
  }

  handleError(error) {
    this.spin.close();
    // this.hintMsg.error(error.msg);
  }
  onCancel() {
    this.visible = !this.visible;
  }
  pageSizeChange(e) {
    this.params.perPage = e;
    this.getData();
  }
  pageIndexChange(e) {
    this.params.curPage = e;
    this.getData();
  }

  /* 
  status: success 成功
        needAccountAuth 帐号需要验证
        oldAccount 老帐号
        passwordError 帐号密码错误
        freeze 脚本卡死
        allProductTried 所有商品都试过了，但找不到合适的 */
  getStartText(s: string) {
    switch (s) {
      case 'success':
        return '成功';
      case 'needAccountAuth':
        return '帐号需要验证';
      case 'oldAccount':
        return '老帐号';
      case 'passwordError':
        return '帐号密码错误';
      case 'freeze':
        return '脚本卡死';
      case 'allProductTried':
        return '所有商品都试过了，但找不到合适的';
      case 'processing':
        return '未完成';
      default: return '未完成'
    }
  }
  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.sub.unsubscribe();
  }
}
