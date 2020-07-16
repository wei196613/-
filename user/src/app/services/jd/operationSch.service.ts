
import { Common, CommonResp } from '../entity';
import { HttpService } from '../http.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class OperationSchService {

  constructor(private http: HttpService) { }

  /**
   * getCouponConfList GET /getCouponConfList
   * 获取优惠券配置信息
   */
  public getCouponConfList() {
    return this.http.get<CouponConfItem[]>('jd/getCouponConfList');
  }

  /**
   * getAddressLabelList GET
   * 获取地址标签列表
   */
  public getAddressLabelList() {
    return this.http.get<AddressLabelList[]>('jd/getAddressLabelList');
  }

  /**
   * getProgramList
   *  GET /getProgramList?perPage=int&curPage=int&name?=string
   * 获取运行方案列表
   */
  public getProgramList(params: { perPage: number; curPage: number; name?: string }) {
    const url = this.http.getUrl('jd/getProgramList?', params);
    return this.http.get<ProgramList>(url);
  }

  /**
   * addProgram 
   * POST /addProgram添加运行方案
   */
  public addProgram(params: AddProgram) {
    params.finalPrice = params.finalPrice.toString();
    return this.http.post<CommonResp>('jd/addProgram', params);
  }

  /**
   * editProgram POST /editProgram
   * 编辑运行方案
   */
  public editProgram(params: EditProgram) {
    return this.http.post<CommonResp>('jd/editProgram', params);
  }

  /**
   * applyProgram 运行
   */
  public applyProgram(id: number) {
    return this.http.post<CommonResp>('jd/applyProgram', { id });
  }
}

export const couponCategory = [
  { value: 0, label: '话费' },
  { value: 1, label: '实物' }
]

export const payment = [
  { value: 0, label: '货到付款' },
  { value: 1, label: '微信支付' }
]

export interface CouponConfItem {
  id: number,
  name: string,
  category: number
}

export interface ProgramItem {
  id: number,
  name: string,
  finalPrice: string,
  flyModeSec: number,
  payment: number,
  applyTime?: number,
  loginType: number,
  couponNames: string,
  couponIds: string,
  labelNames: string,
  labelIds: string,
  isRunJx: number
}

export interface ProgramList extends Common<ProgramItem> {

}

export interface AddProgram {
  name: string,
  finalPrice: string,
  flyModeSec: string,
  payment: number,
  loginType: number,
  couponIds?: number[],
  addressLabels?: number[],
  isRunJx: number;
}

export interface EditProgram extends AddProgram {
  id: number
}

export interface AddressLabelList {
  id: number,
  name: string,
  resetDays: number,
  maximum: number
}
