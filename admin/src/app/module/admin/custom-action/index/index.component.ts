import { NzMessageService } from 'ng-zorro-antd';
import { Component, OnInit } from '@angular/core';
import { ByValueService } from 'src/app/services/by-value.service';
import { AppSpinService } from 'src/app/components/spin-mask/app-spin.service';
import { ActionTypeNames, AddAction, GetActionByKey, ActionTypeNameItem } from 'src/app/services/entity';
import { Subscription } from 'rxjs';
import { CustomActionService } from 'src/app/services/custom-action.service';
@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.less']
})
export class IndexComponent implements OnInit {
  data: ActionTypeNames;
  checkData: GetActionByKey;
  visible: boolean = false;
  sub: Subscription;
  params = {
    perPage: 15,
    curPage: 1,
    keyword: null
  }
  modalKey: 'open_add' | 'open_edit' | 'open_export' = null;
  constructor(private hintMsg: NzMessageService, private byVal: ByValueService, private spin: AppSpinService, private custom: CustomActionService) { }

  ngOnInit() {
    this.getData();
    this.sub = this.byVal.getMeg().subscribe(res => {
      switch (res.key) {
        case 'title_query':
          this.params = {
            perPage: 15,
            curPage: 1,
            keyword: res.data.msg
          }
          this.getData()
          break;
        case 'title_clear':
          this.params = {
            perPage: 15,
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
      }
    })
  }

  private async getData() {
    this.spin.open("获取数据中")
    try {
      const data = await this.custom.getActionNames(this.params);
      this.data = data;
      this.spin.close()
    } catch (error) {
      this.handleError(error.msg)
    }
  }

  private async edit(params: GetActionByKey) {
    this.spin.open("正在修改中")
    try {
      const res = await this.custom.editAction(params);
      await this.getData()
      this.onCancel();
      this.hintMsg.success(res.msg)
    } catch (error) {
      this.handleError(error.msg)
      this.byVal.sendMeg({ key: 'edit_error' })
    }
  }

  private async add(params: AddAction) {
    this.spin.open("正在添加中")
    try {
      const res = await this.custom.addActionType(params);
      await this.getData()
      this.onCancel();
      this.hintMsg.success(res.msg)
    } catch (error) {
      this.handleError(error.msg)
    }
  }

  private async getActionType(key: string, modalKey: 'open_add' | 'open_edit' | 'open_export') {
    this.spin.open("获取数据")
    try {
      const data = await this.custom.getActionByKey(key);
      this.checkData = data
      this.visible = true;
      this.modalKey = modalKey;
      this.spin.close()
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
  /**打开弹框*/
  handleOpenModal(key: 'open_add' | 'open_edit' | 'open_export', data?: ActionTypeNameItem) {
    if (key === 'open_edit' || key === 'open_export') {
      this.getActionType(data.key, key)
    } else {
      this.modalKey = key;
      this.visible = true;
    }
  }
  /**获取导出的JSON对象*/
  get getActionTypeJSON() {
    if (this.checkData) {
      return JSON.stringify(this.checkData, null, 2)
    }
    return ''
  }

  pageIndexChange(e: number) {
    this.params.curPage = e;
    this.getData()
  }

  pageSizeChange(e: number) {
    this.params.perPage = e;
    this.getData()
  }
  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.sub && this.sub.unsubscribe()
  }
}
