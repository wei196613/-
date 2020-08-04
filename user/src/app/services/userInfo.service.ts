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
    private router: Router
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
}
