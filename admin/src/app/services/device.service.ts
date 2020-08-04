import { HttpService } from './http.service';
import { Injectable } from '@angular/core';
import { Common, CommonResp } from './entity';

@Injectable({
  providedIn: 'root'
})
export class DeviceService {

  constructor(private http: HttpService) { }

  /**
   * GET /getDevicesBindAccounts?perPage=int&curPage=number&account?=string
   * 用户 及 绑定的设备数
   */
  public getDevicesBindAccounts(params: { perPage: number, curPage: number, keyword?: string }) {
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
   * GET /getDistributeDevices perPage?=number&curPage?=number&keyword?=string&userId?=number&mode?=boolean&isBindAccount?=number
   * 获取设备列表
   */
  public getDevices(params: { perPage: number, curPage: number, keyword?: string }) {
    const url = this.http.getUrl("getDistributeDevices?", params);
    return this.http.get<DeviceList>(url).toPromise();
  }

  /**
   * getBindAccountsOfDevice getBindAccountsOfDevice?deviceId=int&perPage,curPage,keyword
   * 一个设备用户列表
   * mode默认true绑定到该设备的用户列表传false就是反向
   */
  public getBindAccountsOfDevice(params: { perPage: number, curPage: number, keyword?: string, deviceId: number, mode?: boolean }) {
    const url = this.http.getUrl('getBindAccountsOfDevice?', params);
    return this.http.get<BindAccountsOfDevice>(url).toPromise();
  }

  /**
   * GET /getUserByAccount?account=string
   * 通过账号查找user（account完全匹配）
 
  public getUserByAccount(params: { account: string }) {
    const url = this.http.getUrl("getUserByAccount?", params)
    return this.http.get<UserByAccount>(url).toPromise()
  }  */

  /**
   * getAccountsBindDevices GET /getAccountsBindDevices?perPage?=number&curPage?=number&keyword?=string
   * 设备 及 绑定的用户数
   */
  public getAccountsBindDevices(params: { perPage: number, curPage: number, keyword?: string }) {
    let url = this.http.getUrl('getAccountsBindDevices?', params);
    return this.http.get<AccountsBindDevices>(url).toPromise();
  }

  /**
 * distributeDevice2Users 
 * 分配一个设备到多个用户
 */
  public distributeDevice2Users(params: DistributeDevice2Users) {
    return this.http.post<CommonResp>("distributeDevice2Users", params).toPromise()
  }

}

export interface BindAccountsOfDeviceItem {
  id: number,
  account: string,
  direction?: 'right' | 'left',
  checked?: boolean,
}

export interface BindAccountsOfDevice extends Common<BindAccountsOfDeviceItem> { }

export interface DeviceBinItem {
  id: number,
  account: string,
  devices: number,
  [s: string]: any,
}

export interface DeviceBin extends Common<DeviceBinItem> { }

export interface DeviceItem {
  id: number,
  name: string,
  bindAccounts?: { id: number, account: string }[],
  direction?: 'right' | 'left',
  checked?: boolean,
  mac: string,
  title: string,
  [s: string]: any,
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

export interface AccountsBindDevicesItem {
  id: number,
  deviceName: string,
  devices: { id: number, name: string }[],
  direction?: 'right' | 'left',
  checked?: boolean,
  title: string,
  [s: string]: any,
}

export interface AccountsBindDevices extends Common<AccountsBindDevicesItem> { }


export interface DistributeDevice2Users {
  deviceId: number,
  /**userid*/
  addIds: number[],
  /**userid*/
  removeIds: number[]
}