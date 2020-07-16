
import { HttpService } from '../http.service';
import { Common, CommonResp } from '../entity';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
class DyRunTaskService {

  constructor(private http: HttpService) { }

  /**
   * getRunningClaqueTasks
   * GET /getRunningClaqueTasks?perPage?=Int&curPage?=Int
   * 获取运行捧场任务列表
   */
  public getRunningClaqueTasks(params: { perPage?: number, curPage?: number }) {
    const url = this.http.getUrl('getRunningClaqueTasks?', params)
    return this.http.dy_get<RunTask>(url);
  }

  /**
   * addClaqueTask
   * POST /addClaqueTask
   * 添加新捧场任务
   */
  public addClaqueTask(params: AddRunTaskParams) {
    return this.http.dy_post<CommonResp>('addClaqueTask', params);
  }

  /**
   * terminateClaqueTask
   * POST /terminateClaqueTask
   * 终止捧场任务
   */
  public terminateClaqueTask(id: number) {
    return this.http.dy_post<CommonResp>('terminateClaqueTask', { id });
  }

  /**
   * resumeClaqueTask
   * POST /resumeClaqueTask
   * （暂停后）恢复捧场任务
   */
  public resumeClaqueTask(id: number) {
    return this.http.dy_post<CommonResp>('resumeClaqueTask', { id });
  }

  /**
   * pauseClaqueTask
   * POST /pauseClaqueTask
   * 暂停捧场任务
   */
  public pauseClaqueTask(id: number) {
    return this.http.dy_post<CommonResp>('pauseClaqueTask', { id });
  }

  /**
   * editClaqueTask
   * POST /editClaqueTask
   * 修改捧场任务
   */
  public editClaqueTask(params: EditRunTaskParams) {
    return this.http.dy_post<CommonResp>('editClaqueTask', params);
  }
}

interface RunTaskItem {
  id: number,
  name: string,
  anchorId: string,
  script: {
    id: number,
    name: string,
    totalTime: number,
    characterNumber: number,
    commentNumber: number
  },
  scriptStartTime: number,
  deviceEnterTime: number
  taskStatus: TaskStatus
}

interface RunTask extends Common<RunTaskItem> {

}

interface AddRunTaskParams {
  name: string,
  anchorId: string,
  scriptId: number,
  scriptStartTime: number | Date | string,
  deviceEnterTime: number | Date | string
}

interface EditRunTaskParams extends AddRunTaskParams {
  id: number,
}


enum TaskStatus {
  Preparing = 1, //预备
  Entering = 2, //进场中
  Pausing = 3, //暂停中
  Running = 4 //发言中
}

export {
  DyRunTaskService,
  TaskStatus,
  RunTaskItem,
  RunTask,
  EditRunTaskParams,
  AddRunTaskParams
}