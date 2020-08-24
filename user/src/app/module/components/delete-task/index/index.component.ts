import { format, startOfDay } from 'date-fns';
import { Component, OnInit } from '@angular/core';
import { ByValueService } from 'src/app/services/by-value.service';
import { AppSpinService } from 'src/app/components/spin-mask/app-spin.service';
import { NzMessageService, NzTableComponent } from 'ng-zorro-antd';
import { Subscription } from 'rxjs';
import { TaskTypeNames, MyTaskService, TaskItem, Task, GetTaskTypeById, ParseExcelParams, ExportCheckedTasks, ExportAllTasks } from 'src/app/services/my-task.service';
import { Config } from 'src/app/Config';
declare const resolve: () => void;
@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.less']
})

export class IndexComponent implements OnInit {
  /** 是否展示弹框*/
  visible: boolean = false;

  /**控制弹出的框的内容*/
  modalKey: string;
  /**数据里拉去任务的数据*/
  data: Task;
  /**保存表单配置*/
  formConfig: GetTaskTypeById;
  /**要修改的数据*/
  eidtData: TaskItem;
  /**数据拉去的任务类型数据*/
  taskTypeArr: TaskTypeNames;
  /**解析批量导入任务的excel表所需参数*/
  parseExcelParams: ParseExcelParams;
  /**保存选中要导出的数据id tpe status*/
  checkData: ExportDataItem[] = [];
  /**是否导出全部数据*/
  exportAll: boolean = false;
  /**title日期选择框下的自定义按钮组*/
  ranges = { '此刻': [new Date(), new Date()] };
  /**全部任务状态*/
  taskStatus = Config.taskStatus;
  /**日期选择框绑定数据*/
  rangeDate = null;
  /**筛选数据条件状态、类型下拉框的状态*/
  validateStatus = { status: 'success', taskTypeId: 'success' }
  /**任务类型table表数据*/
  taskTypeTable: TaskTypeNames
  /**拉取任务的查询条件*/
  params = {
    perPage: 10,
    curPage: 1,
    keyword: null,
    taskTypeId: null,
    status: null,
    startTime1: null,
    startTime2: null,
    deleted: true
  }
  sub: Subscription;
  constructor(
    private hintMsg: NzMessageService,
    private spin: AppSpinService,
    private myTask: MyTaskService,
    private byVal: ByValueService) { }

  ngOnInit() {
    this.getData();
    this.getTaskType({ perPage: 100, curPage: 1, forSearch: true })
    this.sub = this.byVal.getMeg().subscribe(res => {
      switch (res.key) {
        case 'get_form_config':
          this.getFormConfig(res.data)
          break;
        case 'get_task_type':
          this.getTaskType(res.data)
          break;
        case 'export_start':
          this.exportAll ? this.exportAllStart(res.data.data, res.data.name) : this.exportStart(res.data.data, res.data.name)
          break;
      }
    })
  }
  /**时间默认时间*/
  get nzDefaultOpenValue() {
    const date = new Date()
    const nzDefaultOpenValue = startOfDay(date);
    return { nzDefaultOpenValue }
  }

  /**title组件中的日期选择框value发生变化执行方法*/
  handleTitleTimeChange() {
    if (this.params.startTime1 && this.params.startTime2) {
      const time1 = new Date(this.params.startTime1).getTime();
      const time2 = new Date(this.params.startTime2).getTime();
      if (time1 > time2) {
        [this.params.startTime2, this.params.startTime1] = [this.params.startTime1, this.params.startTime2]
      }
    }
  }
  /**根据id导出*/
  async exportStart(params: ExportCheckedTasks, name: string) {
    this.spin.open('正在发送导出命令');
    try {
      params.taskIds = this.checkData.map(v => v.id);
      const res = await this.myTask.exportCheckedTasks(params);
      this.data.arr.forEach(v => v.checked = false);
      this.exportAll = false;
      this.spin.close()
      this.hintMsg.success('导出成功');
      this.onCancel();
      let fileName = `-${name}-${format(new Date(), 'yyyy-MM-dd_HH.mm.ss')}`;
      this.saveAsExcelFile(res, fileName);
      this.checkData = [];
    } catch (error) {
      this.handleError(error)
    }
  }
  /**全部导出*/
  async exportAllStart(params: ExportAllTasks, name: string) {
    if (this.params.taskTypeId) {
      params.taskTypeId = this.params.taskTypeId;
    }
    if (this.params.keyword) {
      params.keyword = this.params.keyword;
    }
    if (this.params.startTime1) {
      params.startTime1 = format(this.params.startTime1, 'yyyy-MM-dd HH:mm:ss');
    }
    if (this.params.startTime2) {
      params.startTime2 = format(this.params.startTime2, 'yyyy-MM-dd HH:mm:ss');
    }
    if (this.params.status >= 0) {
      params.status = this.params.status;
    }
    params.deleted = true;
    this.spin.open('正在发送导出命令');
    try {
      const res = await this.myTask.exportAllTasks(params);
      this.spin.close()
      this.hintMsg.success('导出成功');
      let fileName = `-${name}-${format(new Date(), 'yyyy-MM-dd_HH.mm.ss')}`;
      this.saveAsExcelFile(res, fileName);
      this.onCancel();
    } catch (error) {
      this.handleError(error)
    }
  }
  /**导出excel表格*/
  saveAsExcelFile(buffer: any, name: string): void {
    import("file-saver").then(FileSaver => {
      let EXCEL_EXTENSION = '.xlsx';
      buffer = 'data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,' + buffer;
      FileSaver.saveAs(buffer, '导出' + name + EXCEL_EXTENSION);
    });
  }
  /**
   * 导出按钮点击事件
   */
  handleExportTask() {
    let typeId = null;
    if (this.data && this.data.arr && this.exportAll) {
      const filterData = this.data.arr.filter(f => f.checked);
      if ((!this.handleIsCheckTpe(filterData.map(v => v.tpe.id))) || (!this.handleIsCheckStatus(filterData.map(v => v.status)))) {
        return
      }
      typeId = this.data.arr.find(v => v.status === 4 || v.status === 5)?.tpe?.id;
    } else if (this.checkData.length > 0) {
      if ((!this.handleIsCheckTpe(this.checkData.map(v => v.tpe))) || (!this.handleIsCheckStatus(this.checkData.map(v => v.status)))) {
        return false;
      }
      typeId = this.checkData[0].tpe;
    }
    if (typeId) {
      this.getFormConfig(typeId).then(() => this.handleOpenModal('open_export'));
      return;
    }
    this.hintMsg.error('请选择要导出数据');
  }
  /**判断全选是否可全部选中*/
  private handleIsCheckStatus(arr: number[]) {
    if (arr) {
      const len = [... new Set(arr)].length
      switch (len) {
        case 0:
          this.hintMsg.error('没有可导出数据')
          return false;
        case 1:
          if (!(arr[0] === 4 || arr[0] === 5)) {
            this.hintMsg.error('只能导出【成功】或者【失败】的任务');
            return false;
          }
          return true;
        default:
          this.hintMsg.error('状态不一致，不可进行批量导出');
          return false;
      }
    }
    return false;
  }
  /**判断全选数据任务类型是否一直*/
  private handleIsCheckTpe(arr: number[]) {
    if (arr) {
      const len = [... new Set(arr)].length
      switch (len) {
        case 0:
          this.hintMsg.error('请选择要导出数据');
          return false;
        case 1:
          return true;
        default:
          this.hintMsg.error('任务类型不一致，不可进行批量导出');
          return false;
      }
    }
    return false;
  }
  /**
   * 全选按钮选中状态改变事件  
   * */
  handleCheckAll(bool: boolean) {
    if (this.data && this.data.arr) {
      const item: ExportDataItem[] = [];
      const filterData = this.data.arr.filter(f => f.status === 4 || f.status === 5);
      if (!this.handleIsCheckTpe(filterData.map(v => v.tpe.id))) {
        return false;
      }
      if (!this.handleIsCheckStatus(filterData.map(v => v.status))) {
        return false;
      }
      this.data.arr.forEach(v => {
        if (v.status === 4 || v.status === 5) {
          v.checked = !bool;
          item.push({ id: v.id, tpe: v.tpe.id, status: v.status });
        }
      });
      this.checkChange(!bool, item);
    }
  }
  /**
   * 单选按钮选中状态改变事件
   **/
  handleCheckItem(index: number, e?: boolean) {
    const data = this.data.arr[index];
    data.checked = e != null && e != undefined ? e : !data.checked;
    this.checkChange(data.checked, [{ id: data.id, tpe: data.tpe.id, status: data.status }])
  }
  /**
   * 添加 | 移除 导出数据id
  */
  private checkChange(e: boolean, item: ExportDataItem[]) {
    if (e) {
      this.checkData.push(...item);
    } else {
      this.checkData = this.checkData.filter(f => !item.some(n => n.id === f.id));
    }
  }
  /**
   * 当前页数据是否全部选中；
   * */
  get onCheckedAll() {
    return this.data && this.data.arr && this.data.arr.length > 0 && this.data.arr.every(({ checked }) => checked === true);
  }
  /**恢复任务*/
  public async restoreTask(id?: number) {
    this.spin.open('正在恢复任务中');
    try {
      let ids: number[];
      if (id) {
        ids = [id];
      } else {
        if (this.checkData.length === 0) {
          this.hintMsg.error('请选择要恢复的任务')
          resolve();
        }
        ids = this.checkData.map(v => v.id)
      }
      const res = await this.myTask.restoreTask(ids);
      this.checkData = [];
      await this.getData()
      this.hintMsg.success(res.msg)
    } catch (error) {
      this.handleError(error)
    }
  }

  /**
   * 格式化任务结果json字符串
  */
  get getResult() {
    if (this.eidtData && this.eidtData.result) return JSON.stringify(JSON.parse(this.eidtData.result), null, 4);
    return ''
  }
  /**查询按钮点击事件*/
  handleQuery(keyword: string) {
    this.params.curPage = 1;
    this.params.perPage = 10;
    this.params.keyword = keyword;
    this.getData()
  }
  /**重置按钮点击事件*/
  handleReset() {
    this.params = {
      perPage: 10,
      curPage: 1,
      keyword: null,
      status: null,
      taskTypeId: null,
      startTime1: null,
      startTime2: null,
      deleted: true
    }
    this.rangeDate = null;
  }
  /**下拉框选中的值发生变化*/
  handleSelectChange(s: string) {
    this.validateStatus[s] = 'success';
  }
  /**全部导出按钮点击事件*/
  handleAllChange() {
    if (this.params.taskTypeId != null && this.params.taskTypeId != undefined) {
      this.validateStatus.taskTypeId = 'success'
    } else {
      this.exportAll = false;
      this.validateStatus.taskTypeId = 'error';
      return this.hintMsg.error('请选择【任务状态】为“失败”或“成功”和【任务类型】才能执行全选操作')
    }
    this.checkData = [];
    this.data.arr.forEach(v => v.checked = this.exportAll)
  }

  /**
   * 从服务器端获取任务
   * */
  async getData() {
    this.spin.open('获取数据中')
    try {
      const data = await this.myTask.getTasks(this.params);
      data && data.arr && data.arr.forEach(v => v.checked = (this.exportAll && (v.status === 4 || v.status === 5)) || this.checkData.some(({ id }) => id === v.id))
      this.data = data;
      this.spin.close();
      return data;
    } catch (error) {
      this.handleError(error);
    }
  }
  /**
   * 拉取form表单配置项
  */
  private async getFormConfig(id: number) {
    this.spin.open('正在获取数据中。。。')
    try {
      const data = await this.myTask.getTaskTypeById(id);
      this.formConfig = data;
      if (this.modalKey === 'open_add') this.byVal.sendMeg({ key: 'from_config_success' })
      this.spin.close();
      return data;
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * 获取任务类型
  */
  private async getTaskType(params: { perPage: number, curPage: number, keyword?: string, forSearch?: boolean }) {
    this.spin.open('获取任务类型中')
    try {
      const data = await this.myTask.getTaskTypeNames(params);
      if (this.visible) {
        this.taskTypeTable = data;
      } else {
        this.taskTypeArr = data;
      }
      this.spin.close();
    } catch (error) {
      this.handleError(error)
    }
  }
  /**
   * 错误处理
  */
  private handleError(error: Error) {
    this.spin.close();
    this.hintMsg.error(error.message)
  }
  /**
   * 打开弹框前发生事件
   */
  async handleOpenModal(key: string, data?: TaskItem) {
    if (data) {
      this.eidtData = data;
      await this.getFormConfig(this.eidtData.tpe.id);

    }
    this.setModalKey(key);
  }
  /** 
   * 打开弹框
  */
  private setModalKey(key: string) {
    this.modalKey = key;
    this.visible = true;
  }
  pageIndexChange(e) {
    this.params.curPage = e;
    this.getData()
  }
  pageSizeChange(e) {
    this.params.perPage = e;
    this.getData()
  }
  /**
   * 关闭弹框
   */
  onCancel() {
    const timer = setTimeout(() => {
      this.modalKey = '';
      clearTimeout(timer);
    }, 100);
    this.visible = false;
  }
  ngOnDestroy(): void {
    this.sub && this.sub.unsubscribe();
  }
}

interface ExportDataItem {
  id: number;
  tpe: number;
  status: number;
}