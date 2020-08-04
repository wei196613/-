import { FormBuilder } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd';
import { Subscription } from 'rxjs';
import { ByValueService } from 'src/app/services/by-value.service';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { RoleGroupItem } from 'src/app/services/roleGroup.service';

@Component({
  selector: 'app-agent-details-moal',
  templateUrl: './agent-details-moal.component.html',
  styleUrls: ['./agent-details-moal.component.less']
})
export class AgentDetailsMoalComponent implements OnInit {
  @Input() modalKey; // 打开的对话框的键值
  @Output() modalKeyChange = new EventEmitter();
  /**邀请码权限id*/
  roleGroupId: number = null;
  /**邀请码权限数组*/
  @Input() roleGroupList: RoleGroupItem[]
  /**邀请码数量*/
  amount: number = 1;
  account: string = '12122234342';
  adjustmentNunber: number; // 调整米币的数量
  id: number;
  password: string = 'GdeSf34'; // 修改后服务器返回的提示密码串
  balance: number; // 当前米币数量
  generateInviteType: number = 1;
  agentType: boolean;
  generateInviteTypeAll = [
    { value: 0, label: '普通' },
    { value: 1, label: '有限免费' }
  ]
  sub: Subscription
  // inviteNumber = 1; // 生成邀请码的数量
  constructor(private byVal: ByValueService, private hintMsg: NzMessageService, private fb: FormBuilder) { }

  ngOnInit() {
    this.sub = this.byVal.getMeg().subscribe(res => {
      switch (res.key) {
        case 'VIEW_DETAILS':
          this.account = res.data.account;
          this.id = res.data.id;
          this.balance = res.data.balance;
          this.agentType = res.data.agentType;
          break;
        case 'RESET_AGENT_PWD':
          this.password = res.data;
          this.modalKey = 'OPEN_RESET_PASSWORD_SUCCESS'
          break;
        case 'CREATE_INVITATION_CODE':
          this.modalKey = 'GENERATE_INVITE_CODE_SUCCESS'
          break;
        case 'CHANGE_BALANCE':
          this.adjustmentNunber = 1;
          break;
      }
    })
  }
  handleGenerate() {
    if (!(this.roleGroupId > 0)) {
      return this.hintMsg.error('请选择权限');
    }
    if (this.amount < 0) {
      return this.hintMsg.error('请输入生成邀请码个数')
    }
    this.setModalKey = 'GENERATE_INVITE_CODE2';
  }
  get getInviteRole() {
    if (this.roleGroupList) {
      const v = this.roleGroupList.find(v => v.id === this.roleGroupId);
      if (v) return v.name;
    }
    return '';
  }
  get getInviteType() {
    return this.generateInviteTypeAll.find(v => v.value === this.generateInviteType).label;
  }
  set setModalKey(s: string) {
    this.modalKeyChange.emit(s);
    this.modalKey = s
  }
  handleCick(s: string) {
    const params = {
      key: s,
      data: {
        id: this.id,
        amount: this.amount,
        roleGroupId: this.roleGroupId,
        generateInviteType: this.generateInviteType
      }
    }
    if (s === 'REDUCE_MI' || s === 'ADD_MI') {
      if (this.adjustmentNunber < 0) {
        this.hintMsg.error('不能输入小于0的数')
        return;
      }
      params.data.amount = this.adjustmentNunber;
    }
    this.byVal.sendMeg(params)
  }

  close() {
    this.byVal.sendMeg({ key: 'CLOSE_AGENT_DETAILS_MODAL' })
  }
  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.sub.unsubscribe();
  }
}
