import { NzMessageService } from 'ng-zorro-antd';
import { Component, OnInit } from '@angular/core';
import { ByValueService } from 'src/app/services/by-value.service';
import { AppSpinService } from 'src/app/components/spin-mask/app-spin.service';
import { ActionTypeNames, GetActionById, ActionTypeNameItem, EditTaskType, TaskTypes, AddTaskType, TaskTypeItem } from 'src/app/services/entity';
import { Subscription } from 'rxjs';
import { CustomActionService } from 'src/app/services/custom-action.service';
import { TaskTypeService } from 'src/app/services/task-type.service';
@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.less']
})
export class IndexComponent implements OnInit {
  /**action 表格数据*/
  actionData: ActionTypeNames;
  /** 要修改的任务 */
  checkData: EditTaskType;
  /** 对话框状态*/
  visible: boolean = false;
  /**taskType 表格数据 */
  data: TaskTypes;
  sub: Subscription;
  /**查寻taskType的数据*/
  params = {
    perPage: 10,
    curPage: 1,
    keyword: null
  }
  /**控制打开对话框内容*/
  modalKey: 'open_add' | 'open_edit' | 'open_export' = null;
  constructor(
    private hintMsg: NzMessageService,
    private byVal: ByValueService,
    private spin: AppSpinService,
    private custom: CustomActionService,
    private taskType: TaskTypeService) { }

  ngOnInit() {
    this.getData();
    this.sub = this.byVal.getMeg().subscribe(res => {
      switch (res.key) {
        case 'edit_start':
          this.edit(res.data)
          break;
        case 'add_start':
          this.add(res.data)
          break;
        case 'more_action':
          this.getAction(res.data)
          break;
        case 'get_action_config':
          this.getActionType(res.data)
          break;
        case 'get_action_config_all':
          this.getActionTypeAll(res.data)
          break;
      }
    })
  }
  handleTitleQuery(keyword: string) {
    this.params = {
      perPage: 10,
      curPage: 1,
      keyword
    }
    this.getData()
  }
  handleTitleClear() {
    this.params = {
      perPage: 10,
      curPage: 1,
      keyword: null
    }
  }
  /**获取action表*/
  private async getAction(params: { perPage: number, curPage: number, keyword: string }) {
    this.spin.open("获取数据中")
    try {
      const data = await this.custom.getActionNames(params);
      this.actionData = data;
      this.spin.close()
    } catch (error) {
      this.actionData = null;
      this.handleError(error.msg)
    }
  }
  /**获取taskType数据*/
  private async getData() {
    this.spin.open("获取数据中")
    try {
      const data = await this.taskType.getTaskType(this.params);
      this.data = data;
      this.spin.close()
    } catch (error) {
      this.handleError(error.msg)
    }
  }
  /**修改taskType*/
  private async edit(params: EditTaskType) {
    this.spin.open("正在修改中")
    try {
      const res = await this.taskType.editTaskType(params);
      await this.getData()
      this.onCancel();
      this.hintMsg.success(res.msg)
    } catch (error) {
      this.handleError(error.msg)
      this.byVal.sendMeg({ key: 'edit_error' })
    }
  }
  /**添加taskType*/
  private async add(params: AddTaskType) {
    this.spin.open("正在添加中");
    try {
      const res = await this.taskType.addTaskType(params);
      await this.getData()
      this.onCancel();
      this.hintMsg.success(res.msg)
    } catch (error) {
      this.handleError(error.msg)
    }
  }

  /**拼接action name*/
  getActionName(data: TaskTypeItem) {
    return data && data.actionRels ? data.actionRels.map(v => v.name).join('->') : '';
  }

  /**获取action详情*/
  private async getActionType(id: number) {
    this.spin.open("获取数据")
    try {
      const data = await this.custom.getActionById(id);
      this.byVal.sendMeg({ key: 'get_action_config_success', data });
      this.spin.close()
    } catch (error) {
      this.handleError(error.msg)
    }
  }
  /**获取taskType详情*/
  private async getTaskType(id: number, key: 'open_add' | 'open_edit' | 'open_export') {
    this.spin.open("获取数据")
    try {
      const data = await this.taskType.getTaskTypeById(id);
      this.checkData = data;
      this.modalKey = key;
      this.visible = true;
      this.spin.close()
    } catch (error) {
      this.handleError(error.msg)
    }
  }

  private async getActionTypeAll(ids: number[]) {
    const promiseAll = ids.map(i => (this.custom.getActionById(i)))
    this.spin.open('获取数据中')
    try {
      const data = await Promise.all(promiseAll);
      this.byVal.sendMeg({ key: 'get_action_config_all_success', data});
      this.spin.close();
    } catch (error) {
      this.handleError(error.msg)
    }
  }

  private handleError(msg: string) {
    this.spin.close();
  }

  onCancel() {
    this.visible = false;
    const timer = setTimeout(() => {
      this.modalKey = null;
      clearTimeout(timer)
    }, 100);
  }
  /**打开弹框*/
  handleOpenModal(key: 'open_add' | 'open_edit' | 'open_export', data?: ActionTypeNameItem) {
    if (key === 'open_edit' || key === 'open_export') {
      this.getTaskType(data.id, key)
    } else {
      this.modalKey = key;
      this.visible = true;
    }
  }
  /**获取导出的JSON对象*/
  get getActionTypeJSON() {
    if (this.checkData) {
      delete this.checkData.id;
      return JSON.stringify(this.checkData, null, 2)
    }
    return ''
  }

  pageIndexChange(e: number) {
    this.params.curPage = e;
    this.getData()
  }

  pageSizeChange(e: number) {
    this.params.perPage = e;
    this.getData()
  }
  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.sub && this.sub.unsubscribe()
  }
}
