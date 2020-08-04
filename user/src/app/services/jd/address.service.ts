import { Common, CommonResp } from '../entity';
import { HttpService } from '../http.service';
import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class AddressService {

  constructor(private http: HttpService) { }

  /**
   * addAddressLabel POST /addAddressLabel
   * 添加地址标签
   */
  public addAddressLabel(params: AddAddressLabel) {
    return this.http.post<CommonResp>('jd/addAddressLabel', params);
  }

  /**
   * editAddressLabel
   * POST /editAddressLabel
   * 编辑地址标签
   */
  public editAddressLabel(params: EditAddressLabel) {
    return this.http.post<CommonResp>('jd/editAddressLabel', params);
  }

  /**
   * getAddressLabelList GET /getAddressLabelList
   * 获取地址标签列表
   * 
   */
  public getAddressLabelList() {
    return this.http.get<AddressLabelItem[]>('jd/getAddressLabelList');
  }
  /**
   * getAddressList GET /getAddressList?curPage=Int&perPage=Int&address?=string&labelName?=string
   * 获取收货地址
   */
  public getAddressList(params: { curPage: number; perPage: number; address?: string; labelName?: string }) {
    const url = this.http.getUrl('jd/getAddressList?', params);
    return this.http.get<AddressList>(url);
  }

  /**
   * addMultipleAddress POST /addMultipleAddress
   * 批量添加地址
   */
  public addMultipleAddress(params: AddMultipleAddressParams) {
    return this.http.post<AddMultipleAddressRes[]>('jd/addMultipleAddress', params);
  }

  /**
   * editAddress 
   * POST /editAddress
   * 编辑地址
   */
  public editAddress(params: EditAddress) {
    return this.http.post<CommonResp>('jd/editAddress', params);
  }

  /**
   * getAddressSuffixLabelList GET /getAddressSuffixLabelList
   * 获取地址后缀标签列表
   */
  public getAddressSuffixLabelList() {
    return this.http.get<AddressSuffix[]>('jd/getAddressSuffixLabelList')
  }

  /**
   * editAddressSuffixLabel
   * POST /editAddressSuffixLabel
   * 编辑地址后缀标签
   */
  public editAddressSuffixLabel(params: AddressSuffix) {
    return this.http.post<CommonResp>('jd/editAddressSuffixLabel', params);
  }

  /**
   * addAddressSuffixLabel
   * POST /addAddressSuffixLabel
   * 添加地址后缀标签
   */
  public addAddressSuffixLabel(params: AddAddressSuffix) {
    return this.http.post<CommonResp>('jd/addAddressSuffixLabel', params);
  }
}

export interface AddAddressLabel {
  name: string,
  resetDays: number,
  maximum: number
}

export interface EditAddressLabel extends AddAddressLabel {
  id: number
}

export interface AddressLabelItem {
  id: number,
  name: string,
  resetDays: number,
  maximum: number
}

export interface AddressItem {
  id: number,
  address: string,
  stationName: string,
  labelIds: string,
  labels: string,
  suffixId: number,
  suffixLabel: string
}

export interface AddressList extends Common<AddressItem> {

}

export interface AddMultipleAddressParams {
  addresses: string,
  labelIds: [number]
}

export interface EditAddress {
  id: number,
  address: string,
  stationName: string,
  labelIds: [number]
}

export interface AddMultipleAddressRes {
  line: string, //某一行内容
  error: string //出错信息
}

export interface AddAddressSuffix {
  name: String,
  content: String
}

export interface AddressSuffix extends AddAddressSuffix {
  id: number
}

