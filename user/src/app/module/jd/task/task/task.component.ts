// import { DeviceService, DeviceItem } from 'src/app/services/device.service';
import { ByValueService } from 'src/app/services/by-value.service';
import { AppSpinService } from 'src/app/components/spin-mask/app-spin.service';
import { Component, OnInit } from '@angular/core';
import { TaskService, TaskList, TaskItem, TaskDetail } from 'src/app/services/jd/task.service';
import { Subscription } from 'rxjs';
import { format } from "date-fns";
import { Config } from 'src/app/Config';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.less']
})
export class TaskComponent implements OnInit {
  resultArr = Config.taskEndStatus;
  modalKey = '';
  // deviceArr: DeviceItem[];
  date: Date[];
  visible = false;
  sub: Subscription
  constructor(
    private task: TaskService,
    private spin: AppSpinService,
    private byVal: ByValueService
/*     private device: DeviceService */) { }
  params = {
    perPage: 10,
    curPage: 1,
    account: null,
    result: null,
    // deviceId: null,
    start: null,
    end: null,
  }
  data: TaskList;
  checkData: TaskItem;
  taskDetail: TaskDetail;
  ngOnInit() {
    this.getData();
  }

  handleQuery(account: string) {
    this.params.account = account;
    this.params.perPage = 10;
    this.params.curPage = 1;
    this.getData();
  }

  handleReset() {
    this.params = {
      perPage: 10,
      curPage: 1,
      account: null,
      result: null,
      start: null,
      end: null
      // deviceId: null
    }
  }
  // 向服务器获取 数据
  async getData() {
    this.spin.open('正在获取数据');
    if (this.date && this.date.length === 2) {
      this.params.start = format(this.date[0], 'yyyy-MM-dd') + ' 00:00:00';
      this.params.end = format(this.date[1], 'yyyy-MM-dd') + ' 23:59:59';
    } else {
      this.params.start = null;
      this.params.end = null;
    }
    try {
      const data = await this.task.getTaskList(this.params);
      this.data = data;
      this.spin.close()
    } catch (error) {
      this.handleError(error)
    }
  }

  private async getTaskDetail(id: number) {
    this.spin.open('正在获取数据');
    try {
      const res = await this.task.taskDetail(id);
      this.taskDetail = res;
      this.spin.close()
    } catch (error) {
      this.handleError(error)
    }
  }

  async handleOpenModal(key: string, data: TaskItem) {
    if (key === 'open_detail') {
      this.getTaskDetail(data.id)
    }
    this.visible = true;
    this.modalKey = key;
    this.checkData = data;
  }

  handleError(error) {
    this.spin.close();
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
  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.sub && this.sub.unsubscribe();
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

}
