import { Common } from '../entity';
import { HttpService } from '../http.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor(private http: HttpService) { }


  /**
   * getTaskList GET /getTaskList?perPage=int&curPage=int&account?=int&result?=bool&start?=datetime&end?=datetime
   * 获取任务列表
   */
  public getTaskList(params: { perPage: number; curPage: number; account: number; result?: number; start?: number; end?: number; }) {
    const url = this.getUrl('getTaskList?', params);
    return this.http.get<TaskList>(url);
  }

  /**
   * taskDetail GET /taskDetail?id=int
   */
  public taskDetail(id) {
    return this.http.get<TaskDetail>(`taskDetail?id=${id}`);
  }

  private getUrl(url: string, params) {
    for (const key in params) {
      if (params[key] !== null && params[key] !== undefined && params[key] !== '') {
        url += `${key}=${params[key]}&`
      }
    }
    return url.slice(0, -1);
  }
}
export interface TaskList extends Common<TaskItem> {

}

export interface TaskItem {
  id: number,
  account: string,
  deviceName: string,
  startTime: number,
  endTime?: number,
  status: string,
  loginType: number;
  product?: { step: string, id: string, price: number },
  payPrice?: { step: string, price: number }
}

export interface TaskDetail {
  account: string,
  pwd: string,
  url: string,
  address: string,
  orderId?: string,
  coupons: string[]
}