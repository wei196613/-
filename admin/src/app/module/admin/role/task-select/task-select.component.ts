import { Subscription } from 'rxjs';
import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { ActionTypeNames, ActionTypeNameItem } from 'src/app/services/entity';
import { ByValueService } from 'src/app/services/by-value.service';

@Component({
  selector: 'app-task-select',
  templateUrl: './task-select.component.html',
  styleUrls: ['./task-select.component.less']
})
export class TaskSelectComponent implements OnInit {
  /**保存数据库里的数据*/
  data: ActionTypeNames;
  /**保存选中转台变化的任务id*/
  ids: number[] = [];
  /**是否打开提示框*/
  visible = false;
  /**是否启用默认设置得参数*/
  isDefault = false;
  /**复制角色任务的id*/
  @Input() copyId: number = null;
  /**发送修改的数据到父组件中*/
  @Output() taskSelectChange = new EventEmitter();
  /**控制对话框打开的内容*/
  modalKey: string;
  /**保存查询任务的参数*/
  params = {
    perPage: 30,
    curPage: 1,
    keyword: null
  }
  sub: Subscription;
  /**是否选中*/
  getIsChecked(id: number) {
    return this.ids.findIndex(v => v === id)
  }
  constructor(private byVal: ByValueService) { }

  ngOnInit() {
    this.sub = this.byVal.getMeg().subscribe(res => {
      switch (res.key) {
        case 'get_role_details':
          this.copyId = res.data.roleId;
          this.isDefault = false;
          break;
        case 'get_task_type_success':
          this.data = res.data;
          break;
        case 'get_role_detail_success':
          this.data = res.data;
          this.ids = [];
          this.onCancel();
          break;
        default:
          break;
      }
    })
    this.getData();
  }
  /**查询按钮点击事件*/
  handleTitleQuery(keyword: string) {
    this.params = {
      perPage: 30,
      curPage: 1,
      keyword
    }
    this.getData()
  }
  /**清除按钮点击事件*/
  handleTitleClear() {
    this.params = {
      perPage: 30,
      curPage: 1,
      keyword: null
    }
  }

  getChecked({ id, defaultVisible }: ActionTypeNameItem) {
    const index = this.getIsChecked(id);
    if (index != -1 && defaultVisible && (!this.isDefault || this.copyId)) {
      return false;
    } else if (index != -1 || (defaultVisible && (this.isDefault || this.copyId))) {
      return true;
    } else {
      return false;
    }
  }
  checkboxChange(id: number) {
    const index = this.getIsChecked(id)
    index != -1 ? this.ids.splice(index, 1) : this.ids.push(id)
  }

  getData() {
    if (this.copyId) {
      this.byVal.sendMeg({ key: 'get_role_details', data: { ...this.params, roleId: this.copyId } })
    } else {
      this.byVal.sendMeg({ key: 'get_task_type', data: { ...this.params } })
    }
  }
  ngOnDestroy(): void {
    this.sub && this.sub.unsubscribe()
  }
  /**提交*/
  submitForm() {
    let value: { [s: string]: any } = {};
    if (this.isDefault) {
      value.useDefault = true;
    }
    if (this.copyId) {
      value.copyRoleId = this.copyId;
    }
    value.ids = this.ids;
    this.taskSelectChange.emit(value)
  }
  /**关闭对话框*/
  onCancel() {
    this.visible = false;
    const timer = setTimeout(() => {
      this.modalKey = null;
      clearTimeout(timer)
    }, 200);
  }
  /**代开对话框*/
  handleOpenModal(key: string) {
    this.modalKey = key;
    this.visible = true;
  }
  /**使用默认*/
  hanleRecDefault() {
    this.ids = [];
    this.isDefault = true;
    this.copyId = null;
    this.getData();
    this.onCancel();
  }
}
