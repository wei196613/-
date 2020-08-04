import { NzMessageService } from 'ng-zorro-antd';
import { Component, OnInit } from '@angular/core';
import { ByValueService } from 'src/app/services/by-value.service';
import { AppSpinService } from 'src/app/components/spin-mask/app-spin.service';
import { RoleService, EditTaskTypeVisibleOfRoles } from 'src/app/services/role.service';
import { RolesList, EditRoleParams, AddRoleParams, RolesItem, PermissionsList } from 'src/app/services/entity';
import { Subscription } from 'rxjs';
import { TaskTypeService } from 'src/app/services/task-type.service';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.less']
})
export class IndexComponent implements OnInit {
  data: RolesList
  /**要修改的角色数据*/
  checkData: RolesItem;
  perData: PermissionsList
  /**是否打开对话框*/
  visible: boolean = false;
  sub: Subscription;
  params = {
    perPage: 10,
    curPage: 1,
    keyword: null
  }
  /**打开的对话框类型*/
  modalKey: 'open_add' | 'open_edit' | 'open_batch_edit' = null;
  /**保存要批量修改的角色id*/
  roleIds: number[] = [];
  constructor(private hintMsg: NzMessageService, private byVal: ByValueService, private spin: AppSpinService, private role: RoleService, private task: TaskTypeService) { }

  ngOnInit() {
    this.getData();
    this.sub = this.byVal.getMeg().subscribe(res => {
      switch (res.key) {
        case 'title_query':
          this.params = {
            perPage: 10,
            curPage: 1,
            keyword: res.data.msg
          }
          !this.visible && this.getData()
          break;
        case 'title_clear':
          this.params = {
            perPage: 10,
            curPage: 1,
            keyword: null
          }
          break;
        case 'edit_start':
          this.edit(res.data)
          break;
        case 'add_start':
          this.add(res.data)
          break;
        case 'permission_query':
          this.getPermissionsList(res.data)
          break;
        case 'get_task_type':
          this.getTaskType(res.data)
          break;
        case 'more_role_select':
          this.getData(res.data)
          break;
        case 'get_role_details':
          this.getTaskTypeVisibleOfRole(res.data)
          break;
        case 'edits_start':
          this.edits({ ...res.data, roleIds: this.roleIds })
          break;
        default:
          break;
      }
    })
  }

  async getData(params?: { perPage: number; curPage: number; keyword?: string; }) {
    this.spin.open("获取数据中")
    params = params ? params : this.params;
    try {
      const data = await this.role.getRoles(params);
      if (this.visible) {
        this.byVal.sendMeg({ key: 'more_role_select_success', data })
      } else {
        data?.arr.forEach(v => v.checked = this.roleIds.some(id => id === v.id))
        this.data = data;
      }
      this.spin.close()
    } catch (error) {
      this.handleError(error.msg)
    }
  }

  /**批量修改可见性*/
  private async edits(params: EditTaskTypeVisibleOfRoles) {
    this.spin.open("正在修改中")
    try {
      const res = await this.role.batchEditTaskTypeVisibleOfRoles(params);
      this.roleIds = [];
      await this.getData();
      this.onCancel();
      this.hintMsg.success(res.msg)
    } catch (error) {
      this.handleError(error.msg)
    }
  }
  /**获取某角色的任务可见性配置*/
  private async getTaskTypeVisibleOfRole(params: { roleId: number, curPage: number, perPage: number, keyword?: string }) {
    this.spin.open('获取数据中');
    try {
      const data = await this.role.getTaskTypeVisibleOfRole(params);
      this.byVal.sendMeg({ key: 'get_role_detail_success', data });
      this.spin.close();
    } catch (error) {
      this.handleError(error.msg)
    }
  }
  /**修改*/
  private async edit(params: EditRoleParams) {
    this.spin.open("正在修改中")
    try {
      const res = await this.role.editRole(params);
      this.onCancel();
      await this.getData()
      this.hintMsg.success(res.msg)
    } catch (error) {
      this.handleError(error.msg)
    }
  }
  /**添加角色*/
  private async add(params: AddRoleParams) {
    this.spin.open("正在添加中")
    try {
      const res = await this.role.addRole(params);
      await this.getData()
      this.onCancel();
      this.hintMsg.success(res.msg)
    } catch (error) {
      this.handleError(error.msg)
    }
  }

  /**获取权限列表*/
  private async getPermissionsList(params: { perPage: number; curPage: number; keyword?: string }) {
    this.spin.open("获取数据中")
    try {
      const data = await this.role.getPermissionsList(params);
      this.perData = data;
      this.spin.close();
    } catch (error) {
      this.handleError(error.msg)
    }
  }

  private handleError(msg: string) {
    this.spin.close();
  }

  onCancel() {
    this.visible = false;
    const timer = setTimeout(() => {
      this.modalKey = null;
      clearTimeout(timer)
    }, 100);
  }

  handleOpenModal(key: 'open_add' | 'open_edit' | 'open_batch_edit', data?: RolesItem) {
    if (key === 'open_batch_edit') {
      if (this.roleIds.length < 1) {
        return this.hintMsg.error('请勾选角色以后再尝试')
      }
    } else {
      this.getPermissionsList({ perPage: 30, curPage: 1 })
      this.checkData = data
    }
    this.modalKey = key;
    this.visible = true;
  }

  ngOnDestroy(): void {
    this.sub && this.sub.unsubscribe()
  }

  /**获取任务*/
  private async getTaskType(params: { perPage?: number; curPage?: number; keyword?: string; }) {
    this.spin.open('获取数据中。。。')
    try {
      const data = await this.task.getTaskType(params);
      this.byVal.sendMeg({ key: 'get_task_type_success', data });
      this.spin.close();
    } catch (error) {
      this.handleError(error.msg)
    }
  }
  /**判断数据是否全选*/
  get onCheckedAll() {
    return this.data && this.data.arr && this.data.arr.every(v => v.checked)
  }
  /**全选按钮点击事件*/
  handleCheckAll() {
    const checkedAll = !this.onCheckedAll;
    this.data?.arr?.forEach(v => {
      !v.checked && this.roleIds.push(v.id);
      v.checked = checkedAll;
    })
  }
  /**角色点击事件*/
  handleCheckItem(data: RolesItem) {
    data.checked ? this.roleIds.splice(this.roleIds?.findIndex(v => v === data.id), 1) : this.roleIds.push(data.id);
    data.checked = !data.checked;
  }
}
