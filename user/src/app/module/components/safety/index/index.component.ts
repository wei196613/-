import { AppSpinService } from 'src/app/components/spin-mask/app-spin.service';

import { Component, OnInit } from '@angular/core';
import { LoginService } from 'src/app/services/login.service';
import { UserInfo } from 'src/app/services/entity';
import { NzMessageService } from 'ng-zorro-antd';
import { SafetyService } from 'src/app/services/safety.service';
import { ByValueService } from 'src/app/services/by-value.service';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.less']
})
export class IndexComponent implements OnInit {
  /**安全信息*/
  safetyInfo: { qr: string; username: string; sk: string; } = null;
  userInfo: UserInfo
  /**是否打开对话框*/
  visible = false;
  /**保存加密过后的密码*/
  password: string;
  /**对话框类型*/
  modalKey: 'open_select_key' | 'open_validation' | 'open_close_safety' | 'open_input_totp' | 'open_close_login' = null;

  constructor(private login: LoginService, private hintMsg: NzMessageService, private spin: AppSpinService, private safety: SafetyService, private byVal: ByValueService) { }

  ngOnInit() {
    this.userInfo = this.login.userInfo.userInfo;

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
    this.login.logout();
  }

  get freeMibi() {
    if (this.login.userInfo.userInfo) {
      return this.login.userInfo.userInfo.freeList.reduce((pre, { amount }) => pre + amount, 0)
    }
    return 0;
  }
  /**打开对话框*/
  handleOpenModal(key: 'open_select_key' | 'open_validation' | 'open_close_safety' | 'open_input_totp' | 'open_close_login') {
    this.modalKey = key;
    this.visible = true;
  }
  /**关闭对话框*/
  onCancel() {
    this.visible = false;
    const timer = setTimeout(() => {
      this.modalKey = null;
      clearTimeout(timer);
    }, 200);
  }
  async submit(params: { password: string, totp?: number }) {
    try {
      this.userInfo = await this.login.userInfo.getSecretKey(params);
      this.onCancel();
    } catch (error) {
      this.handleError(error);
    }
  }
  /**安全验证点击变化事件*/
  handleTotpChange(e) {
    e ? this.handleOpenModal('open_close_safety') : this.handleOpenModal('open_validation');
  }
  /**打开登录安全验证*/
  handleLoginTotpChange(e) {
    if (!this.userInfo.auths.totp) {
      return this.hintMsg.error('请先通过安全验证后再进行关闭或打开登录验证操作');
    }
    e ? this.handleOpenModal('open_close_login') : this.turnOnLoginProtect();
  }
  /**关闭登录验证*/
  async turnOffLoginProtect(params: { password: string, totp: number }) {
    try {
      this.spin.open('关闭登录验证中')
      const res = await this.safety.turnOffLoginProtect(params);
      this.onCancel();
      this.login.userInfo.getUserInfo('user-info');
      this.hintMsg.success(res.msg);
    } catch (error) {
      this.handleError(error)
    }
  }
  /**开启登录验证*/
  private async turnOnLoginProtect() {
    try {
      this.spin.open('开启登录验证中')
      const res = await this.safety.turnOnLoginProtect();
      await this.login.userInfo.getUserInfo('user-info');
      this.onCancel()
      this.spin.close();
      this.hintMsg.success(res.msg);
    } catch (error) {
      this.handleError(error)
    }
  }
  /**开启安全验证*/
  async getSafetyAuthInfo(params: { password: string }) {
    try {
      this.spin.open('正在验证中');
      this.safetyInfo = await this.safety.getSafetyAuthInfo(params);
      this.password = params.password;
      this.handleOpenModal('open_input_totp');
      this.spin.close();
    } catch (error) {
      this.handleError(error);
    }
  }
  /**关闭安全验证*/
  async turnOffSafetyCertification(params: { password: string, totp: number }) {
    try {
      this.spin.open('正在验证中');
      const res = await this.safety.turnOffSafetyCertification(params);
      await this.login.userInfo.getUserInfo('user-info');
      this.onCancel()
      this.spin.close();
      this.hintMsg.success(res.msg);
    } catch (error) {
      this.handleError(error);
    }
  }
  /**开启验证*/
  async turnOnSafetyCertification(params: { password: string, sk: string, totp: number }) {
    try {
      this.spin.open('正在验证中');
      params.password = this.password;
      const res = await this.safety.turnOnSafetyCertification(params);
      await this.login.userInfo.getUserInfo('user-info');
      this.onCancel();
      this.spin.close();
      this.hintMsg.success(res.msg);
    } catch (error) {
      this.handleError(error);
    }
  }
  /**错误处理*/
  private handleError(error: Error) {
    if (error.message === '449') {
      this.byVal.sendMeg({ key: '449' });
      error.message = '需要二次验证';
    }
    this.hintMsg.error(error.message);
    this.spin.close();
  }
}
