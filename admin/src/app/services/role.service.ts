import { HttpService } from './http.service';
import { Injectable } from '@angular/core';
import { RolesList, PermissionsList, AddRoleParams, CommonResp, EditRoleParams } from './entity';

@Injectable({
  providedIn: 'root'
})
export class RoleService {

  constructor(private http: HttpService) { }

  /**
   * getRoles 
   * GET /getRoles?perPage:number,curPage:number,keyword:string
   * 获取角色列表
   */
  public getRoles(params: { perPage: number, curPage: number, keyword?: string }) {
    const url = this.http.getUrl("getRoles?", params)
    return this.http.get<RolesList>(url).toPromise();
  }
  /**
   * getPermissionsList
   * GET /getPermissionsList?perPage:number,curPage:number,keyword:string
   * 获取权限列表
   */
  public getPermissionsList(params: { perPage: number, curPage: number, keyword?: string }) {
    const url = this.http.getUrl("getPermissionsList?", params)
    return this.http.get<PermissionsList>(url).toPromise();
  }

  /**
   * addRole
   * POST /addRole
   * 添加角色
   */
  public addRole(params: AddRoleParams) {
    return this.http.post<CommonResp>("addRole", params).toPromise();
  }

  /**
   * editRole
   * POST /editRole
   * 修改角色
   */
  public editRole(params: EditRoleParams) {
    return this.http.post<CommonResp>('editRole', params).toPromise();
  }

}
