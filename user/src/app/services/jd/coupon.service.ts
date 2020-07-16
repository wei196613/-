
import { HttpService } from '../http.service';
import { Injectable } from '@angular/core';
import { Common, CommonResp } from '../entity';

@Injectable({
  providedIn: 'root'
})
export class CouponService {

  constructor(private http: HttpService) { }

  /**
   * getCouponList GET /getCouponList?curPage=number&perPage=number&coupon?=string
   * 获得优惠券列表
   */
  public getCouponList(params: { curPage: number; perPage: number; coupon: string }): Promise<CouponList> {
    const url = this.http.getUrl('jd/getCouponList?', params);
    return this.http.get<CouponList>(url);
  }

  /**
   * edit POST /editCoupon
   * 修改优惠券
   */
  public edit(params: EditCouponParams): Promise<CommonResp> {
    return this.http.post<CommonResp>('jd/editCoupon', params);
  }
}

export interface CouponList extends Common<CouponItem> {

}

export interface CouponItem {
  name: string,
  full?: number,
  discount?: number,
  category?: number
}

export interface EditCouponParams {
  oldName: string, //旧名字
  newName: string,//新名字
  full: string,//满
  discount: string,//减
  category: number//类型
}
// category: 0、话费 1、实物
export const categoryArr = [
  { value: 1, label: '实物' },
  { value: 0, label: '话费' }
]