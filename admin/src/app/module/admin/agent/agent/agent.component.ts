import { Component, OnInit } from '@angular/core';
import { AgentType, GetAgentList, GetUserList, RolesList } from 'src/app/services/entity';
import { ByValueService } from 'src/app/services/by-value.service';
import { AdminService } from 'src/app/services/admin.service';
import { Subscription } from 'rxjs';
import { RoleGroupService, RoleGroupItem } from 'src/app/services/roleGroup.service';
import { AppSpinService } from 'src/app/components/spin-mask/app-spin.service';

@Component({
  selector: 'app-agent',
  templateUrl: './agent.component.html',
  styleUrls: ['./agent.component.less']
})
export class AgentComponent implements OnInit {
  agentType: 0 | 1 = 0;
  addCode = false;
  detailsCode = false;
  data: GetAgentList | GetUserList;
  perPage = 10;
  curPage = 1;
  account: string;
  sub: Subscription
  rolesList: RolesList;
  roleGroupList: RoleGroupItem[]
  get isBigAgent() {
    return !(this.agentType === AgentType.USER);
  }
  constructor(private byVal: ByValueService, private admin: AdminService, private roleGroup: RoleGroupService, private spin: AppSpinService) { }

  ngOnInit() {
    this.getRoles()
    this.sub = this.byVal.getMeg().subscribe(res => {
      switch (res.key) {
        case 'GET_AGENT_LIST':
          this.data = res.data;
          break;
        case 'GET_USER_LIST':
          this.data = res.data;
          break;
        case 'title_query':
          this.curPage = 1;
          this.account = res.data.msg;
          this.getData();
          break;
        case 'title_clear':
          this.curPage = 1;
          this.account = null;
          // this.getData();
          break;
        case 'GET_AGENT_LIST':
          this.data = res.data
          break;
        case 'AGENT_ADD':
          this.AddAgent(res.data.account)
          break;
        case 'CREATE_AGENT':
          this.getData();
          break;
        case 'CLOSE_MODAL':
          this.detailsCode = false;
          break;
        case 'RESET_PWD_START':
          this.resetAgentPwd(res.data);
          break;
        case 'REDUCE_MI':
          this.reduceMi(res.data);
          break;
        case 'ADD_MI':
          this.addMi(res.data);
          break;
        case 'GENERATE_START':
          this.generateStart(res.data)
          break;
        case 'CHANGE_BALANCE':
          this.getData()
          break;
        case 'get_roles_list':
          this.rolesList = res.data
          break;
        case 'grant_role2_user':
          this.grantRole2User(res.data)
          break;
        case 'grant_role2_user_success':
          this.getData()
          this.onCancel()
          break;
        case 'GENERATE_INVITE_CODE':
          this.getRoleGroup()
          break;
      }
    });
    this.getData();
  }
  /**拉取邀请码权限*/
  async getRoleGroup() {
    this.spin.open('获取邀请码权限中');
    try {
      const data = await this.roleGroup.getRoleGroupList({ perPage: 10, curPage: 1 });
      this.roleGroupList = data.arr;
      this.spin.close();
    } catch (error) {
      console.log(error);
      this.spin.close()
    }
  }
  // 授予用户角色
  grantRole2User(params: { userId: number, roleIds: number[] }) {
    this.admin.grantRole2User(params)
  }

  // 获取权限列表
  getRoles() {
    this.admin.getRoles({ perPage: 100, curPage: 1 })
  }

  // 根据权限id生成权限字符串
  getRolesString(ids: number[]): string {
    if (!this.rolesList || !ids) return "";
    return this.rolesList.arr.reduce((pre, { id, name }) => {
      ids.forEach(v => {
        if (v === id) {
          pre.push(name)
        }
      })
      return pre
    }, []).join(",")
  }
  getData() {
    switch (this.agentType) {
      case AgentType.USER:
        this.admin.getUserList({ perPage: this.perPage, curPage: this.curPage, account: this.account });
        break;
      case AgentType.AGENT:
        this.admin.getAgentList({ perPage: this.perPage, curPage: this.curPage, account: this.account });
        break;
    }
  }


  setAgentType(s: string) {
    this.data = { arr: [], total: 0 }
    this.agentType = AgentType[s];
    this.curPage = 1;
    this.getData();
  }

  private AddAgent(account) {
    this.admin.createAgent(account);
  }
  // 生成邀请码
  generateStart(data) {
    const params: any = { agentId: data.id };
    if (data.generateInviteType !== null && data.generateInviteType !== undefined) {
      params.isNormal = !data.generateInviteType;
    }
    params.roleGroupId = data.roleGroupId
    params.amount = data.amount
    this.admin.createInvitationCode(params);
  }
  // 减少米币
  private reduceMi(data) {
    let { id, amount } = data;
    amount = 0 - amount;
    this.admin.changeBalance({ id, amount })
  }
  // 增加米币
  private addMi(data) {
    this.admin.changeBalance({ id: data.id, amount: data.amount });
  }
  // 重置密码
  private resetAgentPwd(data) {
    this.admin.resetAgentPwd(data.id);
  }
  /**
   * handleDetails 查看详情
   */
  public handleDetails(data) {
    data.agentType = this.agentType;
    this.detailsCode = true;
    if (this.agentType === AgentType.USER) {
      this.admin.getUserAgent({ id: data.id });
    }
    this.byVal.sendMeg({ key: 'VIEW_DETAILS', data });
  }
  /**
   * handleAdd 添加大管理
   */
  public handleAdd() {
    this.byVal.sendMeg({ key: 'OPEN_ADD' })
    this.addCode = true;
  }
  /**
   * onCancel 关闭对话框
   */
  public onCancel() {
    this.addCode = false;
    this.detailsCode = false;
  }
  pageIndexChange(e) {
    this.curPage = e;
    this.getData();
  }
  pageSizeChange(e) {
    this.perPage = e;
    this.getData();
  }
  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.sub.unsubscribe();
  }
}
