import { Component, OnInit } from '@angular/core';
import { ByValueService } from 'src/app/services/by-value.service';
import { AppSpinService } from 'src/app/components/spin-mask/app-spin.service';
import { NzMessageService } from 'ng-zorro-antd';
import { Subscription } from 'rxjs';
import { DyAccountService, Account, AccountItem, AddParams, EditParams, AccountExcel } from 'src/app/services/dy/dy-account.service';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.less']
})
export class IndexComponent implements OnInit {
  /*   securityUserArr = [
      { value: 1, label: 'QQ', checked: false },
      { value: 2, label: '微博', checked: false },
      { value: 3, label: '手机号', checked: false }
    ] */
  visible = false;
  modalKey = ''
  uploadData: AccountExcel;
  sub: Subscription;
  onBeforeUpload = (file): boolean => {
    if (file) {
      const that = this;
      const fileName = file.name;
      const reader: FileReader = new FileReader();
      reader.onload = (e) => {
        const res = e.target['result'];
        this.parseAccountExcel(res as string)
      }
      reader.readAsDataURL(file);
    }
    return false; // 阻止自动上传
  }

  constructor(
    private hintMsg: NzMessageService,
    private spin: AppSpinService,
    private byVal: ByValueService,
    private account: DyAccountService) { }
  params = {
    perPage: 10,
    curPage: 1,
    keyword: null
  }
  data: Account
  checkData: AccountItem
  taskDetail
  ngOnInit() {
    this.sub = this.byVal.getMeg().subscribe(res => {
      switch (res.key) {
        case 'add_start':
          this.add(res.data);
          break;
        case 'adds_start':
          this.adds();
          break;
        case 'edit_start':
          this.edit(res.data);
          break;
      }
    })
    this.getData();
  }

  handleQuery(msg: string) {
    this.params = {
      perPage: 10,
      curPage: 1,
      keyword: msg
    }
    this.getData()
  }

  handleReset() {
    this.params = {
      perPage: 10,
      curPage: 1,
      keyword: null
    }
  }

  // 解析excel
  async parseAccountExcel(excel: string) {
    this.spin.open('解析中')
    try {
      const data = await this.account.parseAccountExcel(excel);
      this.uploadData = data;
      this.spin.close();
      this.handleOpenModal("open_adds");
    } catch (error) {
      this.handleError(error)
    }
  }
  // 向服务器获取 数据
  async getData() {
    this.spin.open('正在获取数据');
    try {
      const data = await this.account.getAccounts(this.params);
      this.data = data;
      this.spin.close()
      this.onCancel();
    } catch (error) {
      this.handleError(error)
    }
  }

  // 批量添加
  async adds() {
    this.spin.open('添加中');
    try {
      const res = await this.account.importAccounts(this.uploadData.key);
      await this.getData();
      this.hintMsg.success(res.msg)
    } catch (error) {
      this.handleError(error)
    }
  }
  // 添加
  async add(params: AddParams) {
    this.spin.open('添加中');
    try {
      const res = await this.account.addAccount(params);
      await this.getData();
      this.hintMsg.success(res.msg)
    } catch (error) {
      this.handleError(error)
    }
  }
  // 修改
  async edit(params: EditParams) {
    this.spin.open('修改中');
    try {
      const res = await this.account.editAccount(params);
      await this.getData();
      this.hintMsg.success(res.msg)
    } catch (error) {
      this.handleError(error)
    }
  }

  handleOpenModal(key: string, data?: any) {
    this.modalKey = key;
    this.visible = true;
    if (data) {
      this.checkData = data;
    }
  }
  handleError(error) {
    this.spin.close();
  }
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
  // 清除弹框内的组件
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
