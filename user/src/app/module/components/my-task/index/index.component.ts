import { format, startOfDay } from 'date-fns';
import { DeviceService } from 'src/app/module/components/device/device.service';
import { Component, OnInit } from '@angular/core';
import { ByValueService } from 'src/app/services/by-value.service';
import { AppSpinService } from 'src/app/components/spin-mask/app-spin.service';
import { NzMessageService, NzTableComponent } from 'ng-zorro-antd';
import { Subscription } from 'rxjs';
import { CommonService } from 'src/app/services/common.service';
import { TaskTypeNames, AddParams, MyTaskService, TaskItem, Task, GetTaskTypeById, CascadeConstraint, Constraint, EditParams, ParseExcelParams, TaskAddsParams, ExportCheckedTasks, ExportAllTasks } from 'src/app/services/my-task.service';
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
  modalKey: 'open_edit' | 'open_add' | 'open_adds' | 'open_copy' | 'open_result' | 'open_export' | 'open_time';
  /**数据里拉去任务的数据*/
  data: Task;
  /**保存表单配置*/
  formConfig: GetTaskTypeById;
  /**要修改的数据*/
  eidtData: TaskItem;
  /**数据拉去的任务类型数据*/
  taskTypeArr: TaskTypeNames;
  /**是否自动刷新*/
  refresh = false;
  /**保存自动刷新的定时器*/
  refreshTimer: NodeJS.Timeout;
  /** 自动刷新时间 */
  refreshTime = 5;
  /**解析批量导入任务的excel表所需参数*/
  parseExcelParams: ParseExcelParams;
  /**保存选中要导出的数据id tpe status*/
  checkData: ExportDataItem[] = [];
  /**是否导出全部数据*/
  exportAll: boolean = false;
  /**title日期选择框下的自定义按钮组*/
  ranges = { '此刻': [new Date(), new Date()] };
  /**全部任务状态*/
  taskStatus = Config.LoginStatus;
  /**日期选择框绑定数据*/
  rangeDate = null;
  /**任务类型table表数据*/
  taskTypeTable: TaskTypeNames;
  /**筛选数据条件状态、类型下拉框的状态*/
  validateStatus = { status: 'success', taskTypeId: 'success' }
  /**拉取任务的查询条件*/
  params = {
    perPage: 10,
    curPage: 1,
    keyword: null,
    taskTypeId: null,
    status: null,
    startTime1: null,
    startTime2: null
  }
  sub: Subscription;
  constructor(
    private commonSer: CommonService,
    private device: DeviceService,
    private hintMsg: NzMessageService,
    private spin: AppSpinService,
    private myTask: MyTaskService,
    private byVal: ByValueService) { }

  ngOnInit() {

    this.getData();
    this.getTaskType({ perPage: 100, curPage: 1, forSearch: true })
    this.sub = this.byVal.getMeg().subscribe(res => {
      switch (res.key) {
        case 'add_start':
          this.add(res.data);
          break;
        case 'eidt_start':
          this.edit(res.data)
          break;
        case 'get_form_config':
          this.getFormConfig(res.data)
          break;
        case 'get_task_type':
          this.getTaskType(res.data)
          break;
        case 'more_device':
          this.getDevice(res.data)
          break;
        case 'parse_excel':
          this.parseExcelParams = { ...res.data };
          break;
        case 'adds_start':
          this.adds(res.data);
          break;
        case 'export_start':
          this.exportAll ? this.exportAllStart(res.data.data, res.data.name) : this.exportStart(res.data.data, res.data.name)
          break;
        case 'parse_excel_start':
          this.parseExcelParams.paras = res.data;
          this.parseExcel(this.parseExcelParams);
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
  /**下拉框选中的值发生变化*/
  handleSelectChange(s: string) {
    this.validateStatus[s] = 'success';
  }

  /**table checkedbox 是否可选*/
  /*   getCheckDis(data?: TaskItem) {
      return data ? !(data.status === 4 || data.status === 5) : !(this.params.status === 4 || this.params.status === 5 || this.params.status == null);
    } */
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
      const filterData = this.data.arr.filter(f => f.status == 4 || f.status == 5);
      if ((!this.handleIsCheckTpe(filterData.map(v => v.tpe.id))) || (!this.handleIsCheckStatus(filterData.map(v => v.status)))) {
        return false;
      }
      typeId = this.data.arr.find(v => v.status === 4 || v.status === 5).tpe.id;
    } else if (this.checkData.length > 0) {
      typeId = this.checkData[0].tpe;
      if (!this.handleIsCheckTpe(this.checkData.map(v => v.tpe))) {
        return
      }
    }
    if (typeId) {
      this.getFormConfig(typeId).then(() => {
        this.spin.close();
        this.handleOpenModal('open_export')
      });
      return;
    }
    this.hintMsg.error('没有可导出数据');
  }
  /**判断全选是否可全部选中*/
  private handleIsCheckStatus(arr: number[]) {
    if (arr) {
      const len = [... new Set(arr)].length
      console.log(len)
      switch (len) {
        case 0:
          this.hintMsg.error('没有可导出数据')
          return false;
        case 1:
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
      console.log(len)
      switch (len) {
        case 0:
          this.hintMsg.error('没有可导出数据');
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
  handleCheckAll() {
    const bool = !this.onCheckedAll;
    if (this.data && this.data.arr) {
      if (this.data.arr.some(v => this.data.arr.some(i => i.status != v.status))) {
        return this.hintMsg.error('批量操作只能选择同一状态的任务')
      }
      const item: ExportDataItem[] = [];
      this.data.arr.forEach(v => {
        v.checked = bool;
        item.push({ id: v.id, tpe: v.tpe.id, status: v.status });
      });
      this.checkChange(bool, item);
    }
  }
  /**
   * 单选按钮选中状态改变事件
   **/
  handleCheckItem(data: TaskItem, e?: boolean) {
    if (this.checkData.some(v => v.status !== data.status)) {
      return this.hintMsg.error('批量操作只能选择同一状态')
    }
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
  /**是否展示批量按钮*/
  handleIsShowbatchBtn(status: number[]) {
    return this.checkData.some(v => status.some(i => v.status === i));
  }
  /**
   * 当前页数据是否全部选中；
   * */
  get onCheckedAll() {
    return this.data && this.data.arr && this.data.arr.length > 0 && this.data.arr.every(({ checked }) => checked === true);
  }
  /**
   *  是否显示重新运行按钮
  */
  handleIsRun(data: TaskItem) {
    return data && (data.status === 3 || data.status === 5);
  }
  /**
   * 重新运行按钮点击事件
  */
  async handleRunTask(id?: number) {
    this.spin.open('正在重新运行中')
    try {
      let ids: number[];
      if (id) {
        ids = [id];
      } else {
        if (this.checkData.length === 0) {
          this.hintMsg.error('请选择要重新运行的任务')
          resolve();
        }
        ids = this.checkData.map(v => v.id)
      }
      const data = await this.myTask.rerunTask(ids);
      this.checkData = [];
      await this.getData()
      this.hintMsg.success(data.msg)
    } catch (error) {
      this.handleError(error);
    }
  }
  /**
   * 是否显示取消按钮
  */
  handleIsClose(data: TaskItem) {
    return data && (data.status === 0 || data.status === 1 || data.status === 3);
  }

  /**
   * 格式化任务结果json字符串
  */
  get getResult() {
    if (this.eidtData && this.eidtData.result) return JSON.stringify(JSON.parse(this.eidtData.result), null, 4);
    return ''
  }
  /**查询按钮点击事件*/
  handleQuery(keyword) {
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
      startTime2: null
    }
    this.rangeDate = null;
  }
  /**
   * 批量添加
  */
  private async adds(params: TaskAddsParams) {
    this.spin.open('正在添加任务中')
    try {
      const data = await this.myTask.batchImportTasks(params);
      await this.getData()
      this.spin.close();
      this.onCancel();
      this.byVal.sendMeg({ key: 'adds_success' })
      this.hintMsg.success('添加成功')
    } catch (error) {
      this.handleError(error);
    }
  }
  /**全部导出按钮点击事件*/
  handleAllChange() {
    if (this.params.status === 4 || this.params.status === 5) {
      this.validateStatus.status = 'success';
    } else {
      this.exportAll = false;
      this.validateStatus.status = 'error';
      return this.hintMsg.error('请选择【任务状态】为“失败”或“成功”和【任务类型】才能执行全选操作')
    }
    if (this.params.taskTypeId != null && this.params.taskTypeId != undefined) {
      this.validateStatus.taskTypeId = 'success'
    } else {
      this.exportAll = false;
      this.validateStatus.taskTypeId = 'error';
      return this.hintMsg.error('请选择【任务状态】为“失败”或“成功”和【任务类型】才能执行全选操作')
    }
    this.checkData = [];
    this.data.arr.forEach(v => v.checked = this.exportAll && (v.status === 4 || v.status === 5))
  }
  /**
   * parseExcel 解析xslx
   */
  private async parseExcel(params: ParseExcelParams) {
    this.spin.open('解析文件中。。。')
    try {
      const data = await this.myTask.parseTaskParasExcel(params);
      this.byVal.sendMeg({ key: 'parse_excel_success', data });
      this.spin.close();
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * handleIsEdit 是否可以编辑
   */
  public handleIsEdit(data: TaskItem) {
    const { status } = data;
    return status === 0 || status === 1;
  }
  /**
   * 从服务器端获取登录任务
   * */
  async getData() {
    this.spin.open('获取数据中')
    try {
      const data = await this.myTask.getTasks(this.params);
      data && data.arr && data.arr.forEach(v => v.checked = this.checkData.some(({ id }) => id === v.id))
      this.data = data;
      this.spin.close();
      return data;
    } catch (error) {
      this.handleError(error);
    }
  }
  /**
   * 获取设备列表 
   * 
  */
  private async getDevice(params: { curPage: number, perPage: number, keyword?: string }) {
    this.spin.open("获取数据中")
    try {
      const data = await this.device.getDevices(params);
      this.byVal.sendMeg({ key: 'get_device_success', data })
      this.spin.close()
    } catch (error) {
      this.handleError(error)
    }
  }
  /**
   * 拉取form表单配置项
  */
  private async getFormConfig(id: number) {
    this.spin.open('正在获取数据中。。。')
    try {
      const data = await this.myTask.getTaskTypeById(id);
      data?.paras?.sort((a, b) => a.order - b.order)
      data.paras.forEach(v => {
        if (v) {
          v.cascadeConstraint = v.cascadeConstraint ? JSON.parse((v.cascadeConstraint as string)) as CascadeConstraint[] : null;
          v.values = v.values ? JSON.parse((v.values as string)) as { key: string, value: number }[] : null;
          v.constraint = v.constraint ? JSON.parse((v.constraint as string)) as Constraint : null;
        }
      })
      this.formConfig = data;
      if (this.modalKey === 'open_add' || this.modalKey === 'open_adds') {
        this.byVal.sendMeg({ key: 'from_config_success' })
        this.spin.close();
      }
      return data;
    } catch (error) {
      this.handleError(error);
    }
  }
  /**
   * 添加任务
   */
  private async add(params) {
    this.spin.open('正在添加任务')
    try {
      const data = await this.myTask.addTask(params);
      await this.getData()
      this.spin.close()
      this.onCancel();
      this.hintMsg.success('添加成功')
    } catch (error) {
      this.handleError(error);
    }
  }
  /**
 * handleExecuteTask 立即执行任务
 */
  public async handleExecuteTask(id?: number) {
    this.spin.open('正在发送执行命令');
    try {
      let ids: number[];
      if (id) {
        ids = [id];
      } else {
        if (this.checkData.length === 0) {
          return this.hintMsg.error('请选择要立即执行的任务');
          resolve();
        }
        ids = this.checkData.map(v => v.id)
      }
      const res = await this.commonSer.manualExecuteTask(ids);
      this.checkData = [];
      await this.getData();
      this.hintMsg.success(res.msg)
    } catch (error) {
      this.handleError(error)
    }
  }
  /**
   * closeTask 取消任务
   */
  public async closeTask(id) {
    this.spin.open('正在取消任务中');
    try {
      let ids: number[];
      if (id) {
        ids = [id];
      } else {
        if (this.checkData.length === 0) {
          return this.hintMsg.error('请选择要取消任务')
        }
        ids = this.checkData.map(v => v.id)
      }
      const res = await this.commonSer.closeTask(ids);
      this.checkData = [];
      await this.getData()
      this.hintMsg.success(res.msg)
    } catch (error) {
      this.handleError(error)
    }
  }
  /**
   * pauseTask 暂停任务
   */
  public async pauseTask(id?: number) {
    this.spin.open('正在暂停任务中');
    try {
      let ids: number[];
      if (id) {
        ids = [id];
      } else {
        if (this.checkData.length === 0) {
          this.hintMsg.error('请选择要暂停的任务')
          resolve();
        }
        ids = this.checkData.map(v => v.id)
      }
      const res = await this.commonSer.pauseTask(ids);
      this.checkData = [];
      await this.getData()
      this.hintMsg.success(res.msg)
    } catch (error) {
      this.handleError(error)
    }
  }
  /**
   * 修改任务数据
  */
  private async edit(params: EditParams) {
    this.spin.open('修改中')
    try {
      const res = await this.myTask.editTask(params);
      await this.getData();
      this.spin.close();
      this.onCancel();
      this.hintMsg.success(res.msg);
    } catch (error) {
      this.handleError(error)
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
  private handleError(error) {
    this.spin.close();
  }
  /**
   * 打开弹框前发生事件
   */
  handleOpenModal(key: 'open_edit' | 'open_add' | 'open_adds' | 'open_copy' | 'open_result' | 'open_export' | 'open_time', data?: TaskItem) {
    this.refreshTimer && clearInterval(this.refreshTimer); // 防止打开弹框还刷新数据
    if (data) {
      this.eidtData = data;
    }
    switch (key) {
      case 'open_edit':
        this.openEdit();
        break;
      case 'open_copy':
        this.openCopy();
        break;
      case 'open_adds':
        this.getTaskType({ perPage: 10, curPage: 1 });
        this.setModalKey('open_adds');
        break;
      case 'open_add':
        this.getTaskType({ perPage: 10, curPage: 1 });
        this.setModalKey(key);
        break;
      default:
        this.setModalKey(key);
        break;
    }
  }
  /**
   * 打开编辑框
  */
  private openEdit() {
    this.getFormConfig(this.eidtData.tpe.id).then((() => {
      this.spin.close();
      this.setModalKey('open_edit')
    }));
  }
  /**打开复制对话框*/
  private openCopy() {
    this.getFormConfig(this.eidtData.tpe.id).then((() => {
      this.spin.close();
      this.setModalKey('open_copy')
    }));
  }
  /** 
   * 打开弹框
  */
  private setModalKey(key: 'open_edit' | 'open_add' | 'open_adds' | 'open_copy' | 'open_result' | 'open_export' | 'open_time') {
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
      this.modalKey = null;
      this.eidtData = null;
      this.formConfig = null;
      clearTimeout(timer);
    }, 100);
    this.refresh = false;
    this.visible = false;
  }
  ngOnDestroy(): void {
    this.sub && this.sub.unsubscribe();
  }
  /**
   * 关闭或打开自动刷新
  */
  handleRefreshChange(e: boolean) {
    if (e) {
      this.handleOpenModal('open_time')
    } else {
      this.refreshTimer && clearInterval(this.refreshTimer);
    }
  }
  /**
   * 设置自动刷新当前数据
  */
  handleSetInterval() {
    if (this.refreshTime < 0) return this.hintMsg.error('请设置合法秒数');
    this.refreshTimer = setInterval(() => {
      this.getData();
    }, this.refreshTime * 1000)
    this.visible = false;
    this.modalKey = null;
  }
}

interface ExportDataItem {
  id: number;
  tpe: number;
  status: number;
}