import { NzMessageService } from 'ng-zorro-antd';
import { Router, Routes } from '@angular/router';
import { ByValueService } from './by-value.service';
import { Config } from 'src/app/Config';

import { HttpService } from './http.service';
import { AppSpinService } from '../components/spin-mask/app-spin.service';
import { Injectable } from '@angular/core';
import { UserInfo } from './entity';


@Injectable({
  providedIn: 'root'
})
export class UserInfoService {
  private _userInfo: UserInfo;
  private _authority: { key: number, value: string }[];

  authType = false;
  constructor(private spin: AppSpinService,
    private http: HttpService,
    private byVal: ByValueService,
    private router: Router,
    private hinMsg: NzMessageService
  ) { }
  get userInfo() {
    return this._userInfo;
  }
  set userInfo(s: UserInfo) {
    this._userInfo = s;
  }


  get authority() {
    return this._authority;
  }

  set authority(arr: { key: number, value: string }[]) {
    this._authority = arr;
  }

  navigate(path: string) {
    if (path) {
      this.router.navigate([path]);
    }
  }
  /**获取用户的秘钥
   * POST /getSecretKey
   */
  public async getSecretKey(params: { password: string, totp?: number }) {
    this.spin.open('获取密钥中');
    this.userInfo.key = await this.http.post<string>('getSecretKey', params)
    this.spin.close()
    return this.userInfo;
  }

  /**
   * POST /resetTokenAndSecretKey （新）
   * 重置用户的token和秘钥
   */
  public async resetTokenAndSecretKey(params: { password: string, totp?: number }) {
    this.spin.open('重置密钥中');
    this.userInfo.key = await this.http.post<string>('resetTokenAndSecretKey', params)
    this.spin.close();
  }


  /**
  * userInfo GET /userInfo
  */
  public async getUserInfo(routerUrl: string) {
    this.spin.open('正在获取数据');
    try {
      const res = await this.http.get<UserInfo>('userInfo');
      this.userInfo = res;
      res.permissions.sort((a, b) => a - b)
      this.authority = Config.authority.filter(({ key }) => res.permissions.some(v => v === key));
      this.byVal.sendMeg({ key: 'get_user_info_success' });
      if (routerUrl === '/login' || routerUrl == undefined || routerUrl == null) {
        this.router.navigate(['/']);
      } else {
        this.router.navigate([routerUrl]);
      }
      this.spin.close();
    } catch (error) {
      this.spin.close();
      ;
    }
  }
  private handleError(error: Error) {
    this.spin.close();
    this.hinMsg.error(error.message);
  }
}
