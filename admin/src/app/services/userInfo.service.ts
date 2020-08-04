import { NzMessageService } from 'ng-zorro-antd';
import { AppSpinService } from 'src/app/components/spin-mask/app-spin.service';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root'
})
export class UserInfoService {
  private _userInfo: UserInfo;
  constructor(private router: Router, private spin: AppSpinService, private hintMsg: NzMessageService, private http: HttpService) { }
  get userInfo() {
    return this._userInfo;
  }
  set userInfo(s: UserInfo) {
    this._userInfo = s;
  }
  /**
   * getUserInfo
   */
  public getUserInfo(routerUrl: string) {
    this.spin.open('正在获取数据');
    this.http.get<UserInfo>('userInfo').subscribe((res: UserInfo) => {
      this.userInfo = res;
      console.log(routerUrl);

      if (routerUrl === '/login' || routerUrl == undefined) {
        this.router.navigate(['/']);
      } else {
        this.router.navigate([routerUrl]);
      }
      this.spin.close();
    }, error => {
      this.spin.close();
      this.hintMsg.error(error.msg);
    })
  }
}

interface UserInfo {
  account: string
}