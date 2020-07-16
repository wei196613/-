import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { GetActionById, ActionTypeNames, AddAction, CommonResp } from './entity';

@Injectable({
  providedIn: 'root'
})
export class CustomActionService {

  constructor(private http: HttpService) { }
  /**
   * getActionById
   * Get /getActionById?id=number
   * 获取自定义任务类型参数
   */
  public getActionById(id: number) {
    return this.http.get<GetActionById>(`getActionById?id=${id}`).toPromise();
  }

  /**
   * getActionNames
   * GET /getActionNames?perPage?=Int&curPage?=Int&keyword?=string
   * 获取自定义任务类型名称
   */
  public getActionNames(params: { perPage: number, curPage: number, keyword: string }) {
    const url = this.http.getUrl('getActionNames?', params);
    return this.http.get<ActionTypeNames>(url).toPromise();
  }

  /**
   * addActionType
   * POST /addActionType
   * 添加action
   */
  public addActionType(params: AddAction) {
    return this.http.post<CommonResp>('addAction', params).toPromise();
  }

  /**
   * editAction
   */
  public editAction(params: GetActionById) {
    return this.http.post<CommonResp>('editAction', params).toPromise();
  }
}

