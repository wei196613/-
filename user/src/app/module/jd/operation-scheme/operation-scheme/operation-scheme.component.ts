import { Component, OnInit } from '@angular/core';
import { ProgramItem, ProgramList, payment, OperationSchService, AddProgram, EditProgram } from 'src/app/services/jd/operationSch.service';
import { Subscription } from 'rxjs';
import { ByValueService } from 'src/app/services/by-value.service';
import { AppSpinService } from 'src/app/components/spin-mask/app-spin.service';
import { NzMessageService } from 'ng-zorro-antd';


@Component({
  selector: 'app-operation-scheme',
  templateUrl: './operation-scheme.component.html',
  styleUrls: ['./operation-scheme.component.less']
})
export class OperationSchemeComponent implements OnInit {
  applyData: ProgramItem;
  data: ProgramList;
  checkData: ProgramItem
  sub: Subscription;
  visible = false;
  modalKey = '';
  isCopy = false
  params = {
    perPage: 10,
    curPage: 1,
    name: null
  }
  // 付款方式
  getPayment(v: number) {
    if (v >= 0)
      return payment.find(({ value }) => v === value).label;
  }
  constructor(private hintMsg: NzMessageService, private spin: AppSpinService, private byVal: ByValueService, private operSch: OperationSchService) { }

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
      }
    })
  }
  handleQuery(name: string) {
    this.params.name = name;
    this.params.perPage = 10;
    this.params.curPage = 1;
    this.getData();
  }
  handleReset() {
    this.params = {
      perPage: 10,
      curPage: 1,
      name: null
    }
  }
  // 申请应用方案
  async handleApplyProgram(id: number) {
    this.spin.open('正在运行方案');
    try {
      const res = await this.operSch.applyProgram(id);
      await this.getData();
      this.spin.close();
      this.closeModal();
      this.hintMsg.success(res.msg)
    } catch (error) {
      this.handleError(error)
    }
  }
  // 添加运行方案
  async add(params: AddProgram) {
    this.spin.open('正在添加运行方案');
    try {
      const res = await this.operSch.addProgram(params);
      await this.getData();
      this.spin.close();
      this.onCancel();
      this.hintMsg.success(res.msg)
    } catch (error) {
      this.handleError(error)
    }
  }


  // edit 修改运行方案
  async edit(params: EditProgram) {
    this.spin.open('正在修改运行方案');
    try {
      const res = await this.operSch.editProgram(params);
      await this.getData();
      this.spin.close();
      this.onCancel();
      this.hintMsg.success(res.msg)
    } catch (error) {
      this.handleError(error)
    }
  }
  pageIndexChange(e) {
    this.params.curPage = e;
    this.getData()
  }
  pageSizeChange(e) {
    this.params.perPage = e;
    this.getData()
  }
  // 获取数据
  async getData() {
    this.spin.open('正在获取数据');
    try {
      const data = await this.operSch.getProgramList(this.params);
      data.arr.forEach(v => {
        if (v.applyTime) {
          this.applyData = v;
        }
      });
      this.data = data;
      this.spin.close()
    } catch (error) {
      this.handleError(error)
    }
  }
  // 错误处理
  handleError(error) {
    this.spin.close();
  }
  onCancel() {
    this.visible = false;
    this.closeModal();
  }
  // 关闭弹框内的组件
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
  handleOpenModal(s: string, data?: ProgramItem) {
    if (data) {
      this.checkData = data;
    }
    if (s ===  'open_copy') {
      this.modalKey = 'open_edit';
      this.isCopy = true;
    } else {
      this.modalKey = s;
    }
    this.visible = true;
  }
}
