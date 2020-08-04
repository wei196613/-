import { ToolsService } from 'src/app/services/tools.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
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
  /**是否打开对话框*/
  visible = false;
  /**密码输入框的表单*/
  formGroup: FormGroup
  constructor(private login: LoginService, private fb: FormBuilder, private tools: ToolsService) { }

  ngOnInit() {
    this.userInfo = this.login.userInfo.userInfo;
    this.formGroup = this.fb.group({
      password: [null, Validators.required]
    })
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
  /**打开对话框*/
  handleOpenModal() {
    this.visible = true;
  }
  /**关闭对话框*/
  onCancel() {
    this.visible = false;
    this.formGroup.reset()
  }
  async submit() {
    for (const i in this.formGroup.controls) {
      this.formGroup.controls[i].markAsDirty();
      this.formGroup.controls[i].updateValueAndValidity();
    }
    if (this.formGroup.valid) {
      this.userInfo = await this.login.userInfo.getSecretKey(this.tools.MD5(this.tools.MD5(this.formGroup.value.password).toUpperCase()));
      this.onCancel();
    }
  }
}
