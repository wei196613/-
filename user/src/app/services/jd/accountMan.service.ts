import { Common, CommonResp } from '../entity';
import { AppSpinService } from 'src/app/components/spin-mask/app-spin.service';

import { HttpService } from '../http.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AccountManService {

  constructor(private http: HttpService) { }

  /**
   * getAccountList GET /getAccountList?perPage:Int&curPage:Int&account?=string
   * 获取帐号列表
   */
  public getAccountList(params: { perPage: number, curPage: number, account?: string }) {
    // this.spin.open('获取数据中');
    let url = this.http.getUrl('jd/getAccountList?', params);
    return this.http.get<AccountList>(url);
    // this.resRed.handleCallback<>('ACCOUNT_LIST')
  }

  /**
   * addAccount POST /addAccount
   * 添加帐号
   */
  public addAccount(params: AddAccount) {
    // this.spin.open('添加账号中');
    return this.http.post<CommonResp>('jd/addAccount', params);
  }

  /**
   * editAccount POST /editAccount
   * 编辑账户
   */
  public editAccount(params: EditAccount) {
    // this.spin.open('修改账号中');
    return this.http.post<CommonResp>('jd/editAccount', params);
    // this.resRed.handleCallback<>('EDIT_ACCOUNT_SUCCESS', this.http.post())
  }

  /**
   * addMultipleAcounts POST /addMultipleAcounts
   * 多账户导入
   */
  public addMultipleAcounts(params: { accounts: string }) {
    // this.spin.open('导入账号中');
    return this.http.post<AddMultipleAcounts[]>('jd/addMultipleAccounts', params);
  }
}


export interface AccountList extends Common<AccountItem> {

}
export interface AccountItem {
  id: number,
  account: string,
  pwd: string,
  status?: string,
  time: number,
  coupon?: string,
  url?: string, //帐号校验地址
  eye?: boolean;
}

export interface AddAccount {
  account: string,
  pwd: string,
  couponList: [string],
  smsUrl?: string //帐号校验地址
}

export interface EditAccount {
  id: number,
  account: string,
  pwd: string,
  couponList: [string],
  smsUrl?: string //帐号校验地址
}

export interface AddMultipleAcounts {
  line: string, //某一行内容
  error: string //出错信息
}