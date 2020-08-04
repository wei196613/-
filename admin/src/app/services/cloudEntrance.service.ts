import { Common, CommonResp } from './entity';
import { HttpService } from './http.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CloudEntranceService {

  constructor(private http: HttpService) { }

  /**
   * cloudcenter/entrance/getList
   * GET /cloudcenter/entrance/getList?perPage?=int&curPag?e=number&keyword?=string
   * 获取云控入口列表
   */
  public getList(params: { perPage: number, curPage: number, keyword?: string }) {
    const url = this.http.getUrl('cloudcenter/entrance/getList?', params);
    return this.http.get<CloudEntrance>(url).toPromise();
  }



  /**
   * edit
   * POST /cloudcenter/entrance/edit
   * 修改云控入口
   */
  public edit(params: EditParams) {
    return this.http.post<CommonResp>('cloudcenter/entrance/edit', params).toPromise();
  }
}

export interface CloudEntranceItem {
  code: string,
  user: { id: number, account: string },
  deviceNum: number,
  usedDeviceNum: number,
}

export interface CloudEntrance extends Common<CloudEntranceItem> {

}


export interface EditParams {
  id: number,
  deviceNum: number
}

