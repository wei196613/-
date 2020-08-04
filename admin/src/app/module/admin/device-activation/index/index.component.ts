import { NzMessageService } from 'ng-zorro-antd';
import { Component, OnInit } from '@angular/core';
import { ByValueService } from 'src/app/services/by-value.service';
import { AppSpinService } from 'src/app/components/spin-mask/app-spin.service';
import { Subscription } from 'rxjs';
import { DeviceActivationService, DeviceActivation, DeviceActivationItem, Add, Edit, Cancel } from 'src/app/services/device-activation.service';
import { Config } from 'src/app/Config';
declare const resolve: () => void;
@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.less']
})
export class IndexComponent implements OnInit {
  data: DeviceActivation;
  taskStatus = Config.deviceActivation;
  checkData: DeviceActivationItem;
  ids: number[] = []
  visible: boolean = false;
  sub: Subscription;
  params = {
    perPage: 15,
    curPage: 1,
    keyword: null,
    status: null
  }
  modalKey: 'open_add' | 'open_edit' | 'open_export' | 'open_edits' = null;
  constructor(private hintMsg: NzMessageService, private byVal: ByValueService, private spin: AppSpinService, private devAct: DeviceActivationService) { }

  ngOnInit() {
    this.getData();
    this.sub = this.byVal.getMeg().subscribe(res => {
      switch (res.key) {
        case 'edit_start':
          this.edit(res.data)
          break;
        case 'add_start':
          this.add(res.data)
          break;
      }
    })
  }
  /**获取验证码列表*/
  private async getData() {
    this.spin.open("获取数据中")
    try {
      const data = await this.devAct.getDeviceActivation(this.params);
      this.data = data;
      this.spin.close()
    } catch (error) {
      this.handleError(error.msg)
    }
  }
  /**修改验证码*/
  private async edit(params: Edit) {
    this.spin.open("正在修改中")
    try {
      const res = await this.devAct.edit(params);
      await this.getData()
      this.onCancel();
      if (params.ids === this.ids) {
        this.ids = [];
      }

      this.hintMsg.success(res.msg);
    } catch (error) {
      this.handleError(error.msg)
    }
  }
  /**添加验证码*/
  private async add(params: Add) {
    this.spin.open("正在添加中")
    try {
      const res = await this.devAct.add(params);
      await this.getData()
      this.onCancel();
      this.hintMsg.success(res.msg)
    } catch (error) {
      this.handleError(error.msg)
    }
  }
  /**作废验证码*/
  async handleCancel(ids: number[]) {
    if (this.ids && this.ids.length < 1) {
      this.hintMsg.error('请选择要作废掉的激活码');
      resolve();
    }
    this.spin.open("作废中。。。")
    try {
      const res = await this.devAct.cancel({ ids });
      await this.getData();
      if (this.ids === ids) {
        this.ids = [];
      }
      this.hintMsg.success(res.msg)
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
  handleOpenModal(key: 'open_add' | 'open_edit' | 'open_export' | 'open_edits', data?: DeviceActivationItem) {
    if (key == 'open_edits' && this.ids && this.ids.length < 1) {
      return this.hintMsg.error('请选择要修改的激活码')
    }
    this.checkData = data;
    this.modalKey = key;
    this.visible = true;
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
  /**table checkedbox 是否可选*/
  getCheckDis(data?: DeviceActivationItem) {
    return data ? data.status != 1 : false;
  }

  /**
 * 全选按钮选中状态改变事件  
 * */
  handleCheckAll(bool: boolean) {
    if (this.data && this.data.arr) {
      const item: number[] = [];
      this.data.arr.forEach(v => {
        if (v.status === 1) {
          v.checked = bool;
          item.push(v.id);
        }
      });
      this.checkChange(bool, item);
    }
  }
  /**
  * 添加 | 移除 导出数据id
  */
  private checkChange(e: boolean, ids: number[]) {
    if (e) {
      this.ids.push(...ids);
    } else {
      this.ids = this.ids.filter(f => !ids.some(n => n === f));
    }
  }
  /**
   * 当前页数据是否全部选中；
   */
  get onCheckedAll() {
    return this.data && this.data.arr && this.data.arr.length > 0 && this.data.arr.every(({ checked }) => checked === true);
  }
  /**
 * 单选按钮选中状态改变事件
 **/
  handleCheckItem(data: DeviceActivationItem, e?: boolean) {
    if (data && data.status != 1) {
      data.checked = false;
      return false;
    }
    data.checked = e != null && e != undefined ? e : !data.checked;
    this.checkChange(data.checked, [data.id])
  }
  /**查询按钮点击事件*/
  handleQuery(keyword) {
    this.params.curPage = 1;
    this.params.perPage = 10;
    this.params.keyword = keyword;
    this.getData()
  }
  /**重置按钮点击事件*/
  handleReset() {
    this.params = {
      perPage: 10,
      curPage: 1,
      keyword: null,
      status: null
    }
  }
}
