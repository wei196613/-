import { HttpService } from '../http.service';
import { Common } from '../entity';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
class DyHisTaskService {

  constructor(private http: HttpService) { }
  /**
   * getClaqueTaskHis
   * GET /getClaqueTaskHis?
   * perPage?=number
   * curPage?=number
   * keyword?=string
   * taskEndStatus?=number
   * scriptStartTime1?=string
   * scriptStartTime2?=string
   * 获取历史捧场任务列表
   */
  public getClaqueTaskHis(params: ClaqueParams): Promise<HisClaqueTask> {
    const url = this.http.getUrl('dy/getClaqueTaskHis?', params);
    return this.http.get<HisClaqueTask>(url);
  }

  /**
   * GET /getLoginTaskHis?perPage?=IntcurPage?=number
   * keyword?=string
   * loginBeginTime1?=string
   * loginBeginTime2?=string
   * 获取历史登录任务列表
 */
  public getLoginTaskHis(params: LoginParams): Promise<HisLoginTask> {
    const url = this.http.getUrl('dy/getLoginTaskHis?', params);
    return this.http.get<HisLoginTask>(url);
  }

  /**
   * GET /getLoginTaskHisDetail?taskId=number
   * perPage?=number
   * curPage?=number
   * 获取一个登录任务的详情列表
   */
  public getLoginTaskHisDetail(params: TaskHisDetailPrams) {
    const url = this.http.getUrl('dy/getLoginTaskHisDetail?', params)
    return this.http.get<LoginTaskHisDetail>(url);
  }
}

interface CommonParams {
  perPage?: number,
  curPage?: number,
}

interface TaskHisDetailPrams extends CommonParams {
  taskId: number
}

interface LoginParams extends CommonParams {
  keyword?: string,
  loginBeginTime1?: number,
  loginBeginTime2?: number
}
interface ClaqueParams extends CommonParams {
  keyword?: string,
  taskEndStatus?: string,
  scriptStartTime1?: number,
  scriptStartTime2?: number
}

interface HisLoginTaskItem {
  id: number,
  devices: {
    success: number,
    fail: number,
    unused: number
  },
  accounts: {
    success: number,
    fail: number,
    unused: number
  },
  deviceNumber: number,
  script: {
    id: number,
    name: string,
    totalTime: number,
    characterNumber: number,
    commentNumber: number
  },
  loginBeginTime: number,
  loginEndTime: number
}


interface HisLoginTask extends Common<HisLoginTaskItem> { }

interface HisClaqueTaskItem {
  id: number,
  name: string,
  anchorId: string,
  deviceNumber: number,
  script: {
    id: number,
    name: string,
    totalTime: number,
    characterNumber: number,
    commentNumber: number
  },
  scriptRealStartTime: number,
  deviceRealEnterTime: number,
  taskRealEndTime: number,
  totalRuntime: number,
  taskEndStatus: number,
  endDesc?: string
}
interface HisClaqueTask extends Common<HisClaqueTaskItem> { }

interface LoginTaskHisDetailItem {
  dyAccount?: { id: number, account?: string, weibo?: string },
  deviceName?: string,
  loginBeginTime?: number,
  loginEndTime?: number,
  res: 0 | 1 | 2 | 3
}

interface LoginTaskHisDetail extends Common<LoginTaskHisDetailItem> { }


export {
  DyHisTaskService,
  HisLoginTaskItem,
  HisLoginTask,
  HisClaqueTask,
  HisClaqueTaskItem,
  LoginParams,
  ClaqueParams,
  LoginTaskHisDetail
}