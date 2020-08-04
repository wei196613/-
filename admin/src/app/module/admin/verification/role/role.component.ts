import { RoleService } from 'src/app/services/role.service';
import { AppSpinService } from 'src/app/components/spin-mask/app-spin.service';
import { NzMessageService } from 'ng-zorro-antd';
import { Subscription } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { RoleGroupService, AddParams, EditParams, RoleGroup, RoleGroupItem } from 'src/app/services/roleGroup.service';
import { RolesItem } from 'src/app/services/entity';
import { ByValueService } from 'src/app/services/by-value.service';

@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.less']
})
export class RoleComponent implements OnInit {
  /**保存数据拉取的数据 table要使用*/
  data: RoleGroup;
  /**要修改的数据*/
  checkData: RoleGroupItem;
  sub: Subscription
  /***控制对话框的类型*/
  modalKey: string = null;
  /**控制对话框是否打开*/
  visible = false;
  /**保存角色权限*/
  roleList: RolesItem[]
  /**数据库查询条件*/
  params = {
    perPage: 10,
    curPage: 1,
    keyword: null
  }
  constructor(private hintMsg: NzMessageService, private spin: AppSpinService, private roleGroup: RoleGroupService, private role: RoleService, private byVal: ByValueService) { }

  ngOnInit() {
    this.getData();
    this.sub = this.byVal.getMeg().subscribe(res => {
      switch (res.key) {
        case 'add_start':
          this.add(res.data)
          break;
        case 'edit_start':
          this.edit(res.data)
          break;

        default:
          break;
      }
    })
  }
  /**向服务器获取 数据*/
  async getData() {
    this.spin.open('正在获取数据');
    try {
      const data = await this.roleGroup.getRoleGroupList(this.params);
      this.data = data;
      this.spin.close()
      this.onCancel();
    } catch (error) {
      this.handleError(error)
    }
  }
  /**添加*/
  async add(params: AddParams) {
    this.spin.open('添加中');
    try {
      const res = await this.roleGroup.addRoleGroup(params);
      await this.getData();
      this.onCancel();
      this.hintMsg.success(res.msg)
    } catch (error) {
      this.handleError(error)
    }
  }
  /**修改*/
  async edit(params: EditParams) {
    this.spin.open('修改中');
    try {
      const res = await this.roleGroup.editRoleGroup(params);
      await this.getData();
      this.onCancel();
      this.hintMsg.success(res.msg)
    } catch (error) {
      this.handleError(error)
    }
  }
  /**获取角色权限*/
  async getRole() {
    this.spin.open('获取数据中');
    try {
      const data = await this.role.getRoles({ perPage: 50, curPage: 1 });
      this.roleList = data.arr;
      this.spin.close()
      return;
    } catch (error) {
      this.handleError(error)
    }
  }
  getRoleName(arr: { id: number, name: string }[]) {
    if (arr && arr.length > 0)
      return arr.map(v => v.name).join(',');
    return '';
  }
  /**打开对话框*/
  handleOpenModal(key: string, data?: any) {
    this.getRole().then(() => {
      this.modalKey = key;
      this.visible = true;
      if (data) {
        this.checkData = data;
      }
    })
  }
  /**错误处理*/
  handleError(error) {
    this.spin.close();
  }
  /**关闭对话框*/
  onCancel() {
    this.visible = false;
    this.closeModal();
  }
  pageSizeChange(e) {
    this.params.perPage = e;
    this.getData();
  }
  pageIndexChange(e) {
    this.params.curPage = e;
    this.getData();
  }
  // 清除对话框内的组件
  closeModal() {
    const timer = setTimeout(() => {
      this.modalKey = '';
      clearTimeout(timer);
    }, 100);
  }
  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.sub && this.sub.unsubscribe();
  }
}
