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
  public manualExecuteTask(id: number) {
    return this.http.post<CommonResp>('manualExecuteTask', { ids: [id] });
  }

  /**
   * closeTask
   * POST /closeTask
   * 取消任务/关闭任务
   */
  public closeTask(id) {
    return this.http.post<CommonResp>('cancelTask', { ids: [id] });
  }
}
