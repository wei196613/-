import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ByValueService } from 'src/app/services/by-value.service';
import { AppSpinService } from 'src/app/components/spin-mask/app-spin.service';
import { NzMessageService } from 'ng-zorro-antd';
import { RunTask, RunTaskItem, DyRunTaskService, AddRunTaskParams, EditRunTaskParams, TaskStatus } from 'src/app/services/dy/dy-run-task.service';
import { DyPlayService, ScriptsItem, Comments } from 'src/app/services/dy/dy-play.service';

@Component({
  selector: 'app-run-task',
  templateUrl: './run-task.component.html',
  styleUrls: ['./run-task.component.less']
})
export class RunTaskComponent implements OnInit {
  isCopy = false;
  TaskStatus = TaskStatus;
  data: RunTask;
  checkData: RunTaskItem;
  sub: Subscription;
  visible = false;
  scriptsArr: ScriptsItem[];
  scriptsDetails: Comments;
  modalKey = ''
  params = {
    perPage: 10,
    curPage: 1,
    keyword: null
  }
  constructor(
    private hintMsg: NzMessageService,
    private spin: AppSpinService,
    private byVal: ByValueService,
    private runTask: DyRunTaskService,
    private play: DyPlayService) { }

  ngOnInit() {
    this.getData();
    this.sub = this.byVal.getMeg().subscribe(res => {
      switch (res.key) {
        case 'add_start':
          this.add(res.data)
          break;
        case 'edit_start':
          this.edit(res.data)
          break;
        case 'open_detail':
          this.getComments(res.data);
          break;
        case 'more_comments':
          this.getComments(res.data.scriptId, res.data.curPage);
          break;
      }
    })
  }
  handleQuery(keyword: string) {
    this.params.keyword = keyword;
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
  getEndTime(date: number, time: number) {
    if (date && time) {
      return date * 1000 + time
    }
    return 0
  }
  // 获取剧本列表
  async getScripts() {
    this.spin.open('获取剧本列表中')
    try {
      const res = await this.play.getScripts({
        perPage: 20,
        curPage: 1
      })
      this.scriptsArr = res.arr;
      this.spin.close();
    } catch (error) {
      this.handleError(error)
    }
  }
  // 获取剧本详情内容
  async getComments(scriptId: number, curPage = 1) {
    this.spin.open('获取剧本详情中')
    try {
      const res = await this.play.getComments({
        perPage: 10,
        curPage,
        scriptId
      })
      this.scriptsDetails = res;
      this.spin.close();
    } catch (error) {
      this.handleError(error)
    }
  }
  // 添加运行任务
  async add(params: AddRunTaskParams) {
    this.spin.open('正在添加运行任务');
    try {
      const res = await this.runTask.addClaqueTask(params);
      await this.getData();
      this.onCancel();
      this.hintMsg.success(res.msg)
    } catch (error) {
      this.handleError(error)
    }
  }

  // handlePauseTask 暂停任务
  async handlePauseTask(id: number) {
    this.spin.open('正在暂停运行任务');
    try {
      const res = await this.runTask.pauseClaqueTask(id);
      await this.getData();
      this.onCancel();
      this.hintMsg.success(res.msg)
    } catch (error) {
      this.handleError(error)
    }
  }

  // handleResumeTask 恢复任务
  async handleResumeTask(id: number) {
    this.spin.open('正在恢复运行任务');
    try {
      const res = await this.runTask.resumeClaqueTask(id);
      await this.getData();
      this.onCancel();
      this.hintMsg.success(res.msg)
    } catch (error) {
      this.handleError(error)
    }
  }
  // handleTerminateTask 终止任务
  async handleTerminateTask(id: number) {
    this.spin.open('正在终止运行任务');
    try {
      const res = await this.runTask.terminateClaqueTask(id);
      await this.getData();
      this.onCancel();
      this.hintMsg.success(res.msg)
    } catch (error) {
      this.handleError(error)
    }
  }

  // edit 修改运行任务
  async edit(params: EditRunTaskParams) {
    this.spin.open('正在修改运行任务');
    try {
      const res = await this.runTask.editClaqueTask(params)
      await this.getData();
      this.onCancel();
      this.hintMsg.success(res.msg)
    } catch (error) {
      this.handleError(error)
    }
  }
  pageIndexChange(e) {
    this.params.curPage = e;
    this.getData()
  }
  // 获取数据
  async getData() {
    this.spin.open('正在获取数据');
    try {
      const data = await this.runTask.getRunningClaqueTasks(this.params);
      this.data = data;
      this.spin.close()
    } catch (error) {
      this.handleError(error)
    }
  }
  // 错误处理
  handleError(error) {
    this.spin.close();
  }
  onCancel() {
    this.visible = false;
    this.isCopy = false;
    this.closeModal();
  }
  // 关闭弹框内的组件
  closeModal() {
    const timer = setTimeout(() => {
      this.modalKey = '';
      clearTimeout(timer);
    }, 100);
  }
  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.sub && this.sub.unsubscribe();
  }
  async handleOpenModal(s: string, data?) {
    if (data) {
      this.checkData = data;
    }
    await this.getScripts();
    this.visible = true;
    this.modalKey = s;
    if (s === "open_play_detail") {
      this.getComments(data.script.id)
    } else if (s === 'open_copy') {
      this.isCopy = true;
      this.modalKey = 'open_edit';
    }
  }

}
