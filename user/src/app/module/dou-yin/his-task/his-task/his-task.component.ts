import { Component, OnInit } from '@angular/core';
import { AppSpinService } from 'src/app/components/spin-mask/app-spin.service';
import { Subscription } from 'rxjs';
import { format } from "date-fns";
import { DyHisTaskService, LoginParams, ClaqueParams, HisLoginTask, HisClaqueTask, HisClaqueTaskItem, HisLoginTaskItem, LoginTaskHisDetail } from 'src/app/services/dy/dy-his-task.service';
import { Config } from 'src/app/Config';

@Component({
  selector: 'app-his-task',
  templateUrl: './his-task.component.html',
  styleUrls: ['./his-task.component.less']
})
export class HisTaskComponent implements OnInit {
  tabIndex = 0;
  resultArr = Config.taskEndStatus;
  // deviceArr: DeviceItem[];
  date: Date[];
  visible = false;
  sub: Subscription
  constructor(
    private spin: AppSpinService,
    private hisTask: DyHisTaskService) { }
  params = {
    perPage: 10,
    curPage: 1,
    keyword: null,
    result: null,
    start: null,
    end: null,
  }
  claqueData: HisClaqueTask;
  loginData: HisLoginTask
  checkData: HisLoginTaskItem | HisClaqueTaskItem;
  taskDetail: LoginTaskHisDetail;


  ngOnInit() {
    this.getData();
  }

  handleQuery(msg: string) {
    this.params.keyword = msg;
    this.params.perPage = 10;
    this.params.curPage = 1;
    this.getData()
  }

  handleReset() {
    this.params = {
      perPage: 10,
      curPage: 1,
      keyword: null,
      result: null,
      start: null,
      end: null
    }
  }

  // 向服务器获取 数据
  async getData() {
    this.spin.open('正在获取数据');
    if (this.date && this.date.length === 2) {
      this.params.start = format(this.date[0], 'yyyy-MM-dd HH:mm:ss');
      this.params.end = format(this.date[1], 'yyyy-MM-dd HH:mm:ss');
    } else {
      this.params.start = null;
      this.params.end = null;
    }
    if (this.tabIndex === 1) {
      this.getHisLogin()
    } else {
      this.getHisClaque()
    }
  }

  // 获取历史登录记录
  async getHisLogin() {
    this.spin.open('正在获取数据');
    try {
      const { curPage, perPage, keyword, start, end } = this.params;
      const params: LoginParams = { curPage, perPage, keyword, loginBeginTime1: start, loginBeginTime2: end };
      const data = await this.hisTask.getLoginTaskHis(params)
      this.loginData = data
      this.spin.close()
    } catch (error) {
      this.handleError(error)
    }
  }

  // 获取登录详情
  async getHisLoginDetail(curPage: number) {
    this.spin.open("正在获取登录详情")
    try {
      const data = await this.hisTask.getLoginTaskHisDetail({ taskId: this.checkData.id, perPage: 10, curPage })
      this.taskDetail = data;
      this.spin.close()
    } catch (error) {
      this.handleError(error)
    }
  }


  // 获取捧场历史记录
  async getHisClaque() {
    this.spin.open('正在获取数据');
    try {
      const { curPage, perPage, keyword, start, end } = this.params;
      const params: ClaqueParams = { curPage, perPage, keyword, scriptStartTime1: start, scriptStartTime2: end };
      const data = await this.hisTask.getClaqueTaskHis(params)
      this.claqueData = data
      this.spin.close()
    } catch (error) {
      this.handleError(error)
    }
  }


  async handleOpenModal(data) {
    this.checkData = data;
    this.tabIndex === 1 && this.getHisLoginDetail(1)
    this.visible = true;
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
    this.sub && this.sub.unsubscribe();
  }
}
