import { UserInfoService } from './userInfo.service';
import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { AppSpinService } from 'src/app/components/spin-mask/app-spin.service';
import { CommonResp } from './entity';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  loginType = false;
  routerUrl: string;
  constructor(private http: HttpService, private spin: AppSpinService, private router: Router, private hintMsg: NzMessageService, public userInfo: UserInfoService) { }

  /**
   * login 登录
   */
  public async login(params: { account: string, password: string }) {
    this.spin.open('正在登录')
    try {
      const res = await this.http.post<CommonResp>('login', params)
      this.loginType = true;
      this.userInfo.getUserInfo(this.routerUrl);
    } catch (error) {
      this.spin.close();
      
    }
  }

  /**
   * changePwd 修改密码
   */
  public async changePwd(params: { old: string, newPwd: string }) {
    this.spin.open('正在修改密码')
    try {
      const res = await this.http.post<CommonResp>('changePwd', params);
      this.router.navigate(['/main/user-info']);
      this.spin.close();
    } catch (error) {
      this.spin.close();
      
    }
  }

  /**
   * logout 退出登录
   */
  public async logout() {
    this.spin.open('正在退出登录');
    this.routerUrl = this.router.url;
    this.loginType = false;
    try {
      const res = await this.http.post<CommonResp>('logout')
      this.router.navigate(['/login']);
      this.spin.close()
    } catch (error) {
      this.router.navigate(['/login']);
      this.spin.close();
      ;
    }
  }
  /**
   * userRegister POST /userRegister
   * 注册
   */
  public async userRegister(params: { account: string, pwd: string, inviteCode: string, phone?: string, }) {
    this.spin.open('正在注册')
    try {
      const res = await this.http.post<CommonResp>('userRegister', params);
      this.router.navigate(['/login']);
      this.spin.close();
      this.hintMsg.success(res.msg)
    } catch (error) {
      this.spin.close();
      
    }
  }

  /**
   * isLogin 是否登录
   */
  public async isLogin() {
    this.spin.open('正在获取登录状态');
    try {
      const res = await this.http.get<CommonResp>('isLogin');
      this.loginType = true;
      this.userInfo.getUserInfo(this.routerUrl)
    } catch (error) {
      this.router.navigate(['/login']);
      this.spin.close();
      ;
    }
  }
}
