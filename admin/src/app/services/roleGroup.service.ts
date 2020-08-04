import { Common, CommonResp } from './entity';
import { Injectable } from '@angular/core';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGroupService {

  constructor(private http: HttpService) { }

  /**
   * addRoleGroup
   * POST /addRoleGroup
   * 添加角色组（邀请码管理中新建权限）
   */
  public addRoleGroup(params: AddParams) {
    return this.http.post<CommonResp>('addRoleGroup', params).toPromise();
  }

  /**
   * getRoleGroupList
   * GET /getRoleGroupList?perPage?:number,curPage?:number,keyword?:string
   * 获取角色组列表（即邀请码权限管理的列表）
   */
  public getRoleGroupList(params: { perPage?: number, curPage?: number, keyword?: string }) {
    const url = this.http.getUrl('getRoleGroupList?', params);
    return this.http.get<RoleGroup>(url).toPromise();
  }

  /**
   * editRoleGroup
   * POST /editRoleGroup
   * 修改角色组（邀请码管理中修改权限
   */
  public editRoleGroup(params: EditParams) {
    return this.http.post<CommonResp>('editRoleGroup', params).toPromise();
  }
}

export interface RoleGroupItem {
  id: number,
  name: string,
  roles: { id: number, name: string }[]
}

export interface RoleGroup extends Common<RoleGroupItem> { }

export interface AddParams {
  name: string,
  roleIds: number[]
}

export interface EditParams extends AddParams {
  id: number;
}