import { NzMessageService } from 'ng-zorro-antd';
import { Component, OnInit } from '@angular/core';
import { ByValueService } from 'src/app/services/by-value.service';
import { AppSpinService } from 'src/app/components/spin-mask/app-spin.service';
import { RoleService } from 'src/app/services/role.service';
import { RolesList, EditRoleParams, AddRoleParams, RolesItem, PermissionsList } from 'src/app/services/entity';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.less']
})
export class IndexComponent implements OnInit {
  data: RolesList
  checkData: RolesItem;
  perData: PermissionsList
  visible: boolean = false;
  sub: Subscription;
  params = {
    perPage: 10,
    curPage: 1,
    keyword: null
  }
  modalKey: 'open_add' | 'open_edit' = null;
  constructor(private hintMsg: NzMessageService, private byVal: ByValueService, private spin: AppSpinService, private role: RoleService) { }

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
          this.getData()
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
        default:
          break;
      }
    })
  }

  async getData() {
    this.spin.open("获取数据中")
    try {
      const data = await this.role.getRoles(this.params);
      this.data = data;
      this.spin.close()
    } catch (error) {
      this.handleError(error.msg)
    }
  }

  private async edit(params: EditRoleParams) {
    this.spin.open("正在修改中")
    try {
      const res = await this.role.editRole(params);
      await this.getData()
      this.onCancel();
      this.hintMsg.success(res.msg)
    } catch (error) {
      this.handleError(error.msg)
    }
  }

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

  handleOpenModal(key: 'open_add' | 'open_edit', data?: RolesItem) {
    this.getPermissionsList({ perPage: 30, curPage: 1 })
    this.checkData = data
    this.modalKey = key;
    this.visible = true;
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe()
  }
}
