import { HttpService } from '../http.service';
import { Common, CommonResp } from '../entity';
import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
class DyLoginManService {

  constructor(private http: HttpService) { }

  /**
   * getLoginTask
   * GET /getLoginTasks?perPage=Int&curPage=Int&keyword?=String
   * 获取登录任务列表
   */
  public getLoginTask(params: { perPage: number, curPage: number, keyword?: string }): Promise<LoginTask> {
    const url = this.http.getUrl('dy/getLoginTasks?', params);
    return this.http.get<LoginTask>(url);
  }

  /**
   * addLoginTask
   * POST /addLoginTask
   * 添加登录任务
   */
  public addLoginTask(params: AddLoginTaskParams) {
    return this.http.post<CommonResp>('dy/addLoginTask', params);
  }
}

interface LoginTaskItem {
  id: number,
  deviceName: String,
  runningAccount: String,
  loginTime: number,
  totalRuntime: number;
}

interface LoginTask extends Common<LoginTaskItem> { }

interface AddLoginTaskParams {
  devices: number[],
  accounts: number[]
}

export {
  DyLoginManService,
  LoginTask,
  AddLoginTaskParams
}