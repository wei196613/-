import { Common, CommonResp } from './entity';
import { HttpService } from './http.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DeviceActivationService {

  constructor(private http: HttpService) { }

  /**
   * edit
   * POST /editDeviceActivationCode
   * 修改设备激活码（单个、批量 共用）
   */
  public edit(params: Edit) {
    return this.http.post<CommonResp>('editDeviceActivationCode', params).toPromise();
  }

  /**
   * add
   * POST /generateDeviceActivationCode
   * 生成设备激活码（批量）
   */
  public add(params: Add) {
    return this.http.post<CommonResp>('generateDeviceActivationCode', params).toPromise();
  }

  /**
   * getDeviceActivation
   * GET /getDeviceActivationCodes?perPage:number;curPage:number;keyword:string;status:number
   * 获取设备激活码列表
   */
  public getDeviceActivation(params: { perPage: number; curPage: number; keyword: string; status: number }) {
    const url = this.http.getUrl('getDeviceActivationCodes?', params);
    return this.http.get<DeviceActivation>(url).toPromise();
  }

  /**
   * cancel
   * POST /cancelDeviceActivationCode 
   * 作废设备激活码（单个、批量）
   */
  public cancel(params: Cancel) {
    return this.http.post<CommonResp>('cancelDeviceActivationCode', params).toPromise();
  }
}

export interface DeviceActivationItem {
  checked?: boolean;
  id: number,
  code: string,
  deviceName?: string,
  effectiveDays: number, //有效天数
  timeRemaining?: number // 剩余时间，秒数，转换成 天时分秒
  status: number
}

export interface DeviceActivation extends Common<DeviceActivationItem> {

}

export interface Add {
  amount: number
  days: number,
}

export interface Edit extends Cancel {
  days: number
}

declare type Ids = number[];

export interface Cancel {
  ids: Ids;
}