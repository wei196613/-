import { UserInfoService } from './userInfo.service';
import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { AppSpinService } from '../components/spin-mask/app-spin.service';
import { CommonResp } from './entity';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  loginType = false;
  routerUrl: string;
  constructor(private http: HttpService, private spin: AppSpinService, private router: Router, private hintMsg: NzMessageService, private user: UserInfoService) { }

  /**
   * login 登录
   */
  public login(params: { account: string, password: string }) {
    this.spin.open('正在登录')
    this.http.post<CommonResp>('login', params).subscribe(res => {
      this.loginType = true;
      this.user.getUserInfo(this.routerUrl)
    }, error => {
      this.spin.close();
    });
  }

  /**
   * changePwd 修改密码
   */
  public changePwd(params: { old: string, newPwd: string }) {
    this.spin.open('正在修改密码')
    this.http.post<CommonResp>('changePwd', params).subscribe(res => {
      this.loginType = false;
      this.logout()
    }, error => {
      this.spin.close();
    })
  }

  /**
   * logout 退出登录
   */
  public logout() {
    this.spin.open('正在退出登录');
    this.http.post<CommonResp>('logout').subscribe(res => {
      this.router.navigate(['/login']);
      this.spin.close()
    }, error => {
      this.spin.close();
      // this.router.navigate(['/login']);
      // this.hintMsg.error(error.msg);
    })
  }

  /**
   * isLogin 是否登录
   */
  public isLogin() {
    this.spin.open('正在获取登录状态');
    const timer = setTimeout(() => {
      this.http.get<CommonResp>('isLogin').subscribe(res => {
        this.loginType = true;
        this.user.getUserInfo(this.routerUrl)
        // if (this.routerUrl === '/login') {
        //   this.router.navigate(['/jonit']);
        // }
        // this.router.navigate([this.routerUrl]);
        // this.spin.close();
        // this.hintMsg.success(res.msg);
        clearTimeout(timer)
      }, error => {
        // this.loginType = true;
        this.router.navigate(['/login']);
        this.spin.close();
        // this.hintMsg.error(error.msg);
      })
    }, 0)
  }

}
