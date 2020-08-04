import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { GetActionByKey, ActionTypeNames, AddAction, CommonResp } from './entity';

@Injectable({
  providedIn: 'root'
})
export class CustomActionService {

  constructor(private http: HttpService) { }
  /**
   * getActionByKey
   * Get /getActionByKey?id=number
   * 获取自定义action参数
   */
  public getActionByKey(key: string) {
    return this.http.get<GetActionByKey>(`getActionByKey?key=${key}`).toPromise();
  }

  /**
   * getActionNames
   * GET /getActionNames?perPage?=Int&curPage?=Int&keyword?=string
   * 获取自定义action名称
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
  public editAction(params: GetActionByKey) {
    return this.http.post<CommonResp>('editAction', params).toPromise();
  }

}

