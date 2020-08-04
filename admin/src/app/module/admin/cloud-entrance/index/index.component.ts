import { NzMessageService } from 'ng-zorro-antd';
import { Component, OnInit } from '@angular/core';
import { ByValueService } from 'src/app/services/by-value.service';
import { AppSpinService } from 'src/app/components/spin-mask/app-spin.service';
import { Subscription } from 'rxjs';
import { CloudEntranceService, CloudEntrance, CloudEntranceItem,  EditParams } from 'src/app/services/cloudEntrance.service';
@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.less']
})
export class IndexComponent implements OnInit {
  data: CloudEntrance;
  checkData: CloudEntranceItem;
  visible: boolean = false;
  sub: Subscription;
  params = {
    perPage: 10,
    curPage: 1,
    keyword: null
  }
  modalKey: 'open_add' | 'open_edit' | 'open_export' = null;
  constructor(private hintMsg: NzMessageService, private byVal: ByValueService, private spin: AppSpinService, private cloudcente: CloudEntranceService) { }

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

      }
    })
  }

  private async getData() {
    this.spin.open("获取数据中")
    try {
      const data = await this.cloudcente.getList(this.params);
      this.data = data;
      this.spin.close()
    } catch (error) {
      this.handleError(error.msg)
    }
  }

  private async edit(params: EditParams) {
    this.spin.open("正在修改中")
    try {
      const res = await this.cloudcente.edit(params);
      await this.getData()
      this.onCancel();
      this.hintMsg.success(res.msg)
    } catch (error) {
      this.handleError(error.msg)
      this.byVal.sendMeg({ key: 'edit_error' })
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
  handleOpenModal(key: 'open_add' | 'open_edit' | 'open_export', data?: CloudEntranceItem) {
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
}
