import { Subscription } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { ByValueService } from 'src/app/services/by-value.service';
import { AppSpinService } from 'src/app/components/spin-mask/app-spin.service';
import { NzMessageService } from 'ng-zorro-antd';
import { DyLoginManService, LoginTask, AddLoginTaskParams } from 'src/app/services/dy/dy-login-man.service';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.less']
})
export class IndexComponent implements OnInit {
  modalCode = false;
  visible = false;
  sub: Subscription
  constructor(
    private hintMsg: NzMessageService,
    private spin: AppSpinService,
    private byVal: ByValueService,
    private loginTask: DyLoginManService) { }
  params = {
    perPage: 10,
    curPage: 1,
    keyword: null
  }
  data: LoginTask

  ngOnInit() {
    this.sub = this.byVal.getMeg().subscribe(res => {
      switch (res.key) {
        case 'login_add':
          this.add(res.data)
          break;
      }
    })
    this.getData();
  }
  handleQuery(msg: string) {
    this.params.keyword = msg;
    this.params.perPage = 10;
    this.params.curPage = 1;
    this.getData();
  }
  handleReset() {
    this.params = {
      perPage: 10,
      curPage: 1,
      keyword: null
    }
  }
  // 向服务器获取 数据
  async getData() {
    this.spin.open('正在获取数据');
    try {
      const data = await this.loginTask.getLoginTask(this.params);
      this.data = data;
      this.spin.close();
    } catch (error) {
      this.handleError(error)
    }
  }
  // 添加登录任务
  async add(params: AddLoginTaskParams) {
    this.spin.open('正在添加');
    try {
      const res = await this.loginTask.addLoginTask(params);
      await this.getData();
      this.onCancel();
      this.hintMsg.success(res.msg);
      const timer = setTimeout(() => {
        this.modalCode = false;
        clearTimeout(timer);
      }, 100);
    } catch (error) {
      this.handleError(error)
    }
  }

  handleOpenModal() {
    this.modalCode = true;
    this.visible = true;
  }
    private handleError(error) {
      this.spin.close();
      this.hintMsg.error(error.message);
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
}
