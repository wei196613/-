import { HttpService } from './http.service';
import { Injectable } from '@angular/core';
import { Common, CommonResp } from './entity';

@Injectable({
  providedIn: 'root'
})
export class DeviceService {

  constructor(private http: HttpService) { }

  /**
   * GET /getUserList?perPage=int&curPage=number&account?=string
   * 获取用户列表
   */
  public getUserList(params: { perPage: number, curPage: number, keyword?: string }) {
    console.log(params);

    let url = this.http.getUrl('getDevicesBindAccounts?', params);
    return this.http.get<DeviceBin>(url).toPromise();
  }

  /**
   * distributeDevice 
   * 分配设备/修改设备分配
   */
  public distributeDevice(params: { userId: number, deviceIds: number[] }) {
    return this.http.post<CommonResp>("distributeDevice", params).toPromise()
  }

  /**
   * GET /getDistributeDevices perPage?=Int&curPage?=Int&keyword?=string&userId?=Int&mode?=boolean&isBindAccount?=Int
   * 获取设备列表
   */
  public getDevices(params: { perPage: number, curPage: number, keyword?: string }) {
    const url = this.http.getUrl("getDistributeDevices?", params);
    return this.http.get<DeviceList>(url).toPromise();
  }

  /**
   * GET /getUserByAccount?account=string
   * 通过账号查找user（account完全匹配）
   */
  public getUserByAccount(params: { account: string }) {
    const url = this.http.getUrl("getUserByAccount?", params)
    return this.http.get<UserByAccount>(url).toPromise()
  }
}

export interface DeviceBinItem {
  id: number,
  account: string,
  devices: {
    id: number, name: string, direction?: 'right' | 'left',
    checked?: boolean
  }[]
}

export interface DeviceBin extends Common<DeviceBinItem> { }

export interface DeviceItem {
  id: number,
  name: string,
  bindAccount?: string,
  direction?: 'right' | 'left',
  checked?: boolean,
  mac: string
}

export interface DeviceList extends Common<DeviceItem> { }

export interface UserByAccount {
  id: number,
  account: string,
  balance: number,
  total: number, //历史消耗米币数
  today: number, //今日消耗
  roleIds: [number],
  devices: { id: number, name: string }[]
}
