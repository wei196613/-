import { AppSpinService } from './../components/spin-mask/app-spin.service';
import { NzMessageService } from 'ng-zorro-antd';
import { ByValueService } from './by-value.service';
import { HttpService } from './http.service';
import { Injectable } from '@angular/core';
import { GetAgentList, GetUserList, GetUserAgent, CreateAgent, ResetAgentPwd, GetInvitationCodeListParams, GetInvitationCodeList, TaskList, TaskDetail, RolesList, CommonResp } from './entity';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private http: HttpService, private byVal: ByValueService, private hintMsg: NzMessageService, private spin: AppSpinService) { }

  /**
   * GET /getRoles?perPage?=Int&curPage?=Int&keyword?=string
   * 获取角色列表
   */
  public getRoles(params: { perPage: number, curPage: number, keyword?: string }) {
    const url = this.http.getUrl('getRoles?', params);
    this.spin.open('正在获取数据')
    this.http.get<RolesList>(url).subscribe(data => this.handleSuccess('get_roles_list', data), error => this.handleError(error))
  }

  /**
   * getAgentList   /getAgentList?perPage=int&curPage=Int&account?=string
   * 获取代理列表
   */
  public getAgentList(params: { perPage: number, curPage: number, account?: string }) {
    let url = this.http.getUrl('getAgentList?', params);
    this.spin.open('正在获取数据')
    this.http.get<GetAgentList>(url).subscribe(data => this.handleSuccess('GET_AGENT_LIST', data), error => this.handleError(error))
  }

  /**
   * GET /getUserList?perPage=int&curPage=Int&account?=string
   * 获取用户列表
   */
  public getUserList(params: { perPage: number, curPage: number, account?: string }) {
    let url = this.http.getUrl('getUserList?', params);
    this.spin.open('正在获取数据')
    this.http.get<GetUserList>(url).subscribe(data => this.handleSuccess('GET_USER_LIST', data), error => this.handleError(error))
  }

  /**
   * getUserAgent GET /getUserAgent?id=int
   * 获取某个用户的关系代理
   */
  public getUserAgent(params: { id: number }) {
    let url = this.http.getUrl('getUserAgent?', params);
    this.spin.open('正在获取数据');
    this.http.get<GetUserAgent>(url).subscribe(data => this.handleSuccess('GET_USER_AGENT', data), error => this.handleError(error))
  }

  /**
   * POST / grantRole2User
   * 授予用户角色
   */
  public grantRole2User(params: { userId: number, roleIds: number[] }) {
    this.spin.open('正在授权中')
    this.http.post<CommonResp>('grantRole2User', params).subscribe(data => {
      this.handleSuccess('grant_role2_user_success', data)
      this.hintMsg.success(data.msg)
    }, error => this.handleError(error))
  }

  /**
   * createAgent POST /createAgent
   * 创建新代理
   */
  public createAgent(account: string) {
    this.spin.open('正在创建');
    this.http.post<CreateAgent>('createAgent', { roleIds: [], account }).subscribe(data => this.handleSuccess('CREATE_AGENT', data), error => this.handleError(error))
  }

  /**
   * POST /resetAgentPwd
   * 重置代理密码
   */
  public resetAgentPwd(id) {
    this.spin.open('重置密码中');
    this.http.post<ResetAgentPwd>('resetUserPassword', { id }).subscribe(data => {
      this.handleSuccess('RESET_AGENT_PWD', data);
      this.hintMsg.success('重置成功')
    }, error => this.handleError(error))
  }

  /**
   * getInvitationCodeList 获取邀请码列表
   */
  public getInvitationCodeList(params: GetInvitationCodeListParams) {
    this.spin.open('正在获取数据');
    let url = this.http.getUrl('getInvitationCodeList?', params);
    this.http.get<GetInvitationCodeList>(url).subscribe(data => this.handleSuccess('GET_INVITATION_CODE_LIST', data), error => this.handleError(error))
  }

  /**
   * deleteInvitationCode POST /deleteInvitationCode
   * 删除邀请码
   */
  public deleteInvitationCode(id: number) {
    this.spin.open('作废中');
    this.http.post('deleteInvitationCode', { id }).subscribe(data => {
      this.byVal.sendMeg({ key: 'DELETE_INVITATION_CODE', data });
      this.hintMsg.success('操作成功');
    }, error => {
      this.handleError(error)
    })
  }

  /**
   * changeBalance POST /changeBalance
   * 增减余额
   */
  public changeBalance(params: { id: number; amount: number }) {
    this.spin.open('金额修改中');
    this.http.post<number>('changeBalance', params).subscribe(data => {
      this.handleSuccess('CHANGE_BALANCE', data)
      // this.hintMsg.success('金额已修改')
      this.byVal.sendMeg({ key: 'CLOSE_MODAL' });
    }, error => this.handleError(error))
  }

  /**
   * createInvitationCode POST /createInvitationCode
   * 生成邀请码
   * amount?: Int //有值表示送限时代币的邀请码 无值表示普通邀请码
   */
  public createInvitationCode(params: { id: number, isNormal?: boolean }) {
    this.spin.open('正在生成中');
    this.http.post<number>('createInvitationCode', params).subscribe(data => {
      this.handleSuccess('CREATE_INVITATION_CODE', data)
      this.hintMsg.success('生成成功')
    }, error => this.handleError(error))
  }

  /**
   * getTaskList GET /getTaskList?perPage=int&curPage=int&account?=int&isSuccess?=bool&start?=datetime&end?=datetime
   * 获取任务列表
   */
  public getTaskList(params: { perPage: number; curPage: number; account: number; isSuccess?: boolean; start?: number; end?: number; }) {
    const url = this.http.getUrl('getTaskList?', params);
    return this.http.get<TaskList>(url).toPromise();
  }

  /**
   * taskDetail GET /taskDetail?id=int
   */
  public taskDetail(id) {
    return this.http.get<TaskDetail>(`taskDetail?id=${id}`).toPromise();
  }

  /**
   * GET /taskLog?id=int
   * 
   */
  public taskLog(id: number) {
    return this.http.get<string[]>(`taskLog?id=${id}`).toPromise();
  }

  private handleSuccess(key, data) {
    this.byVal.sendMeg({ key, data });
    this.spin.close()
  }

  private handleError(error) {
    this.spin.close();
    console.log(error);
    // this.hintMsg.error(error.msg);
  }
}
