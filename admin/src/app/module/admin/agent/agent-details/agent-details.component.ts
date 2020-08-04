import { RoleGroupItem } from 'src/app/services/roleGroup.service';
import { ByValueService } from 'src/app/services/by-value.service';
import { AgentType, GetAgentItem, GetUserItem, RolesList } from 'src/app/services/entity';
import { Component, OnInit, Input, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-agent-details',
  templateUrl: './agent-details.component.html',
  styleUrls: ['./agent-details.component.less']
})
export class AgentDetailsComponent implements OnInit {
  @Input() roleGroupList: RoleGroupItem;
  visible = false; // 重置密码状态
  modalKey = 'OPEN_RESET_PASSWORD';
  data: GetAgentItem | GetUserItem;
  roles: RolesList;
  roleIds: number;
  sub: Subscription;
  adjustmentNunber: number;
  constructor(private byVal: ByValueService) { }

  ngOnInit() {
    this.sub = this.byVal.getMeg().subscribe(res => {
      switch (res.key) {
        case 'VIEW_DETAILS':
          this.data = res.data;
          this.roleIds = res.data.roleIds
          break;
        case 'GET_USER_AGENT':
          this.data.userAgent = res.data;
          break;
        case 'CLOSE_MODAL':
          this.visible = false;
          break;
        case 'CLOSE_AGENT_DETAILS_MODAL':
          this.onCancel();
          break;
        case 'get_roles_list':
          this.roles = res.data
          break;
        default:
          break;
      }
    })
  }
  handleOpenModal(key: string) {
    this.visible = true;
    this.modalKey = key;
    this.byVal.sendMeg({ key, data: this.data });
  }
  getAgentType(s: string): number {
    return AgentType[s];
  }
  /**
   * onCancel 关闭弹窗
   */
  public onCancel() {
    setTimeout(() => {
      this.modalKey = '';
      // console.log(this.modalKey);
    }, 100);
    this.visible = false;
  }
  close() {
    this.byVal.sendMeg({ key: 'grant_role2_user', data: { userId: this.data.id, roleIds: this.roleIds } })
  }
  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.sub.unsubscribe()
  }
}
