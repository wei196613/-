import { Common, CommonResp } from '../entity';

import { HttpService } from '../http.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
class DyAccountService {

  constructor(private http: HttpService) { }

  /**
   * getAccounts
   * GET /getAccounts?perPage=number&curPage=number&keyword?=string
   * 获取账号列表
   */
  public getAccounts(params: { perPage: number, curPage: number, keyword?: string }): Promise<Account> {
    const url = this.http.getUrl('dy/getAccounts?', params);
    return this.http.get<Account>(url);
  }

  /**
   * addAccount
   * POST /addAccount
   * 添加帐号
   */
  public addAccount(params: AddParams): Promise<CommonResp> {
    return this.http.post<CommonResp>('dy/addAccount', params);
  }

  /**
   * editAccount 
   * POST /editAccount
   * 修改账号
   */
  public editAccount(params: EditParams) {
    return this.http.post<CommonResp>('dy/editAccount', params);
  }

  /**
   * importAccounts 
   * POST /importAccounts
   * 导入账号
   */
  public importAccounts(excelKey: string) {
    return this.http.post<CommonResp>('dy/importAccounts', { excelKey });
  }
  /**
   * parseAccountExcel
   * POST /parseAccountExcel
   * 解析账号excel文件
   */
  public parseAccountExcel(excel: string) {
    return this.http.post<AccountExcel>('dy/parseAccountExcel', { excel });
  }
}

interface AccountExcel extends Common<AddParams> {
  key: string,
  total: number
}

interface AccountItem {
  id: number,
  account?: string,
  weibo?: string,
  weiboPswd?: string;
  runningDeviceName?: string;
  checked?: boolean; // 前端表格需要选中状态 
}

interface Account extends Common<AccountItem> { }

interface AddParams {
  weiboAccount: string,
  weiboPswd: string
}

interface EditParams extends AddParams {
  id: number;
}

export {
  DyAccountService,
  AccountItem,
  Account,
  AddParams,
  EditParams,
  AccountExcel
}