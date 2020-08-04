import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { AddTaskType, EditTaskType, CommonResp, TaskTypes } from './entity';

@Injectable({
  providedIn: 'root'
})

export class TaskTypeService {

  constructor(private http: HttpService) { }

  /**
   * addTaskType
   * 添加任务类型(新建组合任务类型)
   */
  public addTaskType(params: AddTaskType) {
    return this.http.post<CommonResp>('addTaskType', params).toPromise();
  }

  /**
   * editTaskType
   * 修改任务类型(新建组合任务类型)
   */
  public editTaskType(params: EditTaskType) {
    return this.http.post<CommonResp>('editTaskType', params).toPromise();
  }

  /**
   * getTaskType
   * 获取任务类型(新建组合任务类型)
   */
  public getTaskType(params: { perPage?: number, curPage?: number, keyword?: string }) {
    const url = this.http.getUrl('getTaskTypeNames?onlyUsable=false&', params);
    return this.http.get<TaskTypes>(url).toPromise()
  }

  /**
   * getTaskTypeById
   *  获取任务类型ById
  */
  public getTaskTypeById(id: number) {
    return this.http.get<EditTaskType>(`getTaskTypeById?id=${id}&withDefaultParas=true`).toPromise();
  }
}
