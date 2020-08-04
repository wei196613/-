import { CommonResp } from 'src/app/services/entity';
import { HttpService } from 'src/app/services/http.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor(private http: HttpService) { }
  /**
   * manualExecuteTask
   * POST /manualExecuteTask
   * 手动执行任务
   */
  public manualExecuteTask(ids: number[]) {
    return this.http.post<CommonResp>('manualExecuteTask', { ids });
  }

  /**
   * closeTask
   * POST /closeTask
   * 取消任务/关闭任务
   */
  public closeTask(ids: number[]) {
    return this.http.post<CommonResp>('cancelTask', { ids });
  }

  /**
   * pauseTask
   * pauseTask{ids :number[]}
   * 暂停
   */
  public pauseTask(ids: number[]) {
    return this.http.post<CommonResp>('pauseTask', { ids });
  }
}
