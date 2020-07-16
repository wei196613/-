import { Component, OnInit } from '@angular/core';
import { LoginService } from 'src/app/services/login.service';
import { UserInfo } from 'src/app/services/entity';

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.less']
})
export class UserInfoComponent implements OnInit {
  userInfo: UserInfo
  constructor(private login: LoginService) { }

  ngOnInit() {
    this.userInfo = this.login.userInfo.userInfo
  }
  navigate(path: string) {
    this.login.userInfo.navigate(path)
  }

  /**
 * changePassword 修改密码
 */
  changePassword() {
    this.navigate('');
  }
  /**
   * logout 退出登录
   */
  logout() {
    // this.auth.logout();
    this.login.logout();
  }

  get freeMibi() {
    if (this.login.userInfo.userInfo) {
      return this.login.userInfo.userInfo.freeList.reduce((pre, { amount }) => pre + amount, 0)
    }
    return 0;
  }
}
