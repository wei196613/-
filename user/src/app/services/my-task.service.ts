import { Common, CommonResp } from 'src/app/services/entity';
import { HttpService } from './http.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MyTaskService {

  constructor(private http: HttpService) { }

  /**
   * getTaskTypeById
   * Get /getTaskTypeById?id=number
   * 获取自定义任务类型参数
   */
  public getTaskTypeById(id: number) {
    return this.http.get<GetTaskTypeById>(`getTaskTypeById?id=${id}`);
  }

  /**
   * getTaskTypeNames
   * GET /getTaskTypeNames?perPage?=number&curPage?=number&keyword?=string
   * 获取自定义任务类型名称
   */
  public getTaskTypeNames(params: { perPage: number, curPage: number, keyword?: string }) {
    const url = this.http.getUrl('getTaskTypeNames?', params);
    return this.http.get<TaskTypeNames>(url);
  }

  /**
   * addTask POST /addTask
   * 添加任务
   */
  public addTask(params: AddParams) {
    return this.http.post<CommonResp>('addTask', params);
  }
  /**
  * editTask POST /editTask
  * 添加任务
  */
  public editTask(params: EditParams) {
    return this.http.post<CommonResp>('editTask', params);
  }

  /**
   * getTasks
   * GET /getTasks?perPage?=number&curPage?=number&keyword?=string
   * 获取任务列表
   */
  public getTasks(params: { perPage: number, curPage: number, keyword?: string }) {
    const url = this.http.getUrl('getTasks?', params)
    return this.http.get<Task>(url)
  }

  /**
   * parseTaskParasExcel
   * POST /parseTaskParasExcel
   * 解析并检查任务参数excel文件
   */
  public parseTaskParasExcel(params: ParseExcelParams) {
    return this.http.post<ParseExcelRes>('parseTaskParasExcel', params);
  }

  /**
   * batchImportTasks
   * POST /batchImportTasks
   * 批量导入任务
   */
  public batchImportTasks(params: TaskAddsParams) {
    return this.http.post<CommonResp>('batchImportTasks', params);
  }

  /**
   * rerunTask
   * POST /rerunTask
   * 重新运行任务
   */
  public rerunTask(id: number) {
    return this.http.post<CommonResp>('rerunTask', { ids: [id] });
  }

  /**
   * exportCheckedTasks
   * POST /exportCheckedTasks
   * 导出(选中的)任务
   */
  public exportCheckedTasks(params: ExportCheckedTasks) {
    return this.http.post<string>('exportCheckedTasks', params);
  }

  /**
   * exportAllTasks
   * POST /exportAllTasks
   * 导出(搜索出来的)全部任务
   */
  public exportAllTasks(params: ExportAllTasks) {
    return this.http.post<CommonResp>('exportAllTasks', params);
  }

}

export interface ExportAllTasks {
  taskTypeId: number,
  keyword?: string,
  commonCols?: number[],//要导出的字段(公共部分1-8)
  typeCols?: string[],//要导出的字段的key名(不同任务类型部分9-n)
  startTime1?: string,
  startTime2?: string,
  status?: number;
}

export interface TaskAddsParams {
  taskTypeId: number,
  name?: string,
  bindDeviceIds: number[],
  executeMethod: number,//1-立即执行，2-手动执行，3-计划执行
  scheduledTime: string,//选了计划执行才要填计划执行时间
  consistentParas: string, // 格式如下
  difParas: string[],// 参数的key名
  excelKey: string
}

export interface ParseExcelParams {
  taskTypeId: number,
  paras: string[],
  excel: string
}

export interface ParseExcelRes {
  key: string, // excel Key
  total: number,
  arr: string[],
}

export interface AddParams {
  taskTypeId: number,
  name?: string,
  bindDeviceId: number,
  executeMethod: number,//1-立即执行，2-手动执行，3-计划执行
  scheduledTime: string,//选了计划执行才要填计划执行时间
  paras: string // 格式如下[{"key":"xxx","value":1},{"key":"yyy","value":"aaa"}]
}

export interface EditParams extends AddParams {
  id: number
}

export interface Constraint {
  max?: number,
  min?: number,
  format?: string,
  required?: boolean
}

export interface CascadeConstraint {
  max?: number,
  min?: number,
  key: string // 关联的键
  constraint: Constraint
}

export interface TaskTypeNameItem {
  id: number,
  name: string, // 任务名：中文
  key: string, // 任务键值：英文
  parasTotal: number,
  checked?: boolean;
}

export interface TaskTypeNames extends Common<TaskTypeNameItem> {

}

export interface Paras {
  name: string,
  key: string,
  tpe: number,
  values: string | { key: string, value: number }[],// select类型才有 {key:string,value:string}
  constraint: string | Constraint, // （该参数的独立约束）
  cascadeConstraint: string | CascadeConstraint, // 格式如注所说明，满足该参数值=value或a<=参数值<=b时，隐藏/显示其他的字段
  tip: string,
  errTip?: string;
  checked?: boolean;
}

export interface GetTaskTypeById {
  id: number;
  name: string, // 任务名：中文
  key: string, // 任务键值：英文
  paras: Paras[]
}

export interface TaskItem {
  id: number,
  tpe: { id: number, name: string },
  name?: string,
  paras: string,
  bindDevices: { id: number, name: string }[],
  runningDevice?: { id: number, name: string },//不一定有
  status: number //0-等待手动执行(只有手动执行的任务有该状态)；1-待推送(三种都显示待推送)，2-已推送，3-正在运行，4-成功，5-失败，6-已取消
  result?: string,// 成功或失败(有结果的任务)才可能有结果
  executeMethod: number,//1-立即执行，2-手动执行，3-计划执行
  scheduledTime: number,//选了计划执行才要填计划执行时间
  startTime?: number,
  endTime?: number,
  checked?: boolean; // 标记数据是否选中
}

export interface ExportCheckedTasks {
  taskIds: number[],
  commonCols?: number[],//要导出的字段(公共部分1-8)
  typeCols?: string[],//要导出的字段的key名(不同任务类型部分9-n)
}

export interface Task extends Common<TaskItem> { }