import { LoginService } from './../../services/login.service';
import { Component, Input } from '@angular/core';
import { Router } from "@angular/router";
// import { AppSpinService } from "../spin-mask/app-spin.service";
// import { HttpService } from "../../services/http/http.service";
import { NzMessageService } from "ng-zorro-antd";
import { UserInfoService } from 'src/app/services/userInfo.service';
// import { Config } from "../../Config";

@Component({
  selector: 'app-frame',
  templateUrl: './app-frame.component.html',
  styleUrls: ['./app-frame.component.less']
})
export class AppFrameComponent {
  @Input() menuItems: MenuItem[] = [];

  constructor(public router: Router, private login: LoginService, public user: UserInfoService) {

  }

  navigate(path: string) {
    if (path) {
      this.router.navigate([path]);
    }
  }
  /**
   * changePassword 修改密码
   */
  changePassword() {
    this.navigate('change-password');
  }
  /**
   * logout 退出登录
   */
  logout() {
    // this.auth.logout();
    this.login.logout();
  }
}

export interface MenuItem {
  title: string;
  path?: string;
  icon?: string;
}
