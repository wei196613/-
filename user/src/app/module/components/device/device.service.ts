
import { Injectable } from '@angular/core';
import { CommonResp, Common } from 'src/app/services/entity';
import { HttpService } from 'src/app/services/http.service';

@Injectable({
  providedIn: 'root'
})
export class DeviceService {

  constructor(private http: HttpService) { }

  /**
   * GET /getUserList?perPage=int&curPage=Int&account?=string
   * 获取用户列表
   */
  public getUserList(params: { perPage: number, curPage: number, keyword?: string }) {
    console.log(params);
    let url = this.http.getUrl('getDevicesBindAccounts?', params);
    return this.http.get<DeviceBin>(url);
  }

  /**
   * distributeDevice 
   * 分配设备/修改设备分配
   */
  public distributeDevice(params: { userId: number, deviceIds: number[] }) {
    return this.http.post<CommonResp>("distributeDevice", params)
  }


  /**
   * editDevice POST /editDevice
   * 修改设备
   */
  public editDevice(params: { id: number, name: string }) {
    return this.http.post<CommonResp>('editDevice', params)
  }

  /**
   * GET /getDevices perPage?=Int&curPage?=Int&keyword?=string
   * 获取设备列表
   */
  public getDevices(params: { perPage: number, curPage: number, keyword?: string }) {
    const url = this.http.getUrl("getDevices?", params);
    return this.http.get<DeviceList>(url);
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
  runningAccount?: string,  // dy
  todayTask?: number, // jd
  bindAccount?: string,
  mac: string,
  direction?: 'right' | 'left',
  checked?: boolean;
  title?: string;
}

export interface DeviceList extends Common<DeviceItem> { }
