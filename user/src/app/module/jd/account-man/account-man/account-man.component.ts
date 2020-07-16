import { AddAccount, EditAccount, AccountList, AccountManService, AccountItem } from 'src/app/services/jd/accountMan.service';
import { NzMessageService } from 'ng-zorro-antd';
import { ByValueService } from 'src/app/services/by-value.service';
import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AppSpinService } from 'src/app/components/spin-mask/app-spin.service';

@Component({
  selector: 'app-account-man',
  templateUrl: './account-man.component.html',
  styleUrls: ['./account-man.component.less']
})
export class AccountManComponent implements OnInit {
  visible = false;
  modalKey = ''
  data: AccountList;
  params = {
    perPage: 10,
    curPage: 1,
    account: null
  }
  errorData: { line: string, error: string }[]; // 多行导入出错提示
  editData: AccountItem;
  sub: Subscription;
  constructor(private accMan: AccountManService, private byVal: ByValueService, private hintMsg: NzMessageService, private spin: AppSpinService) { }

  ngOnInit() {
    this.sub = this.byVal.getMeg().subscribe(res => {
      switch (res.key) {
        case 'ADD_START':
          this.addAccount(res.data);
          break;
        case 'ADDS_START':
          this.addMultipleAcounts({ accounts: res.data })
          break;
        case 'EDIT_START':
          this.editAccount(res.data)
          break;
      }
    })
    this.getData();
  }
  handleEye(e: boolean) {
    this.data.arr.forEach(v => v.eye = e)
  }

  handleQuery(account: string) {
    this.params = {
      perPage: 10,
      curPage: 1,
      account
    }
    this.getData();
  }

  handleReset() {
    this.params = {
      perPage: 10,
      curPage: 1,
      account: null
    }
  }

  /**
  * 批量导入账号
  */
  private async addMultipleAcounts(params: { accounts: string }) {
    this.spin.open('正在导入中')
    try {
      console.log(params);
      const data = await this.accMan.addMultipleAcounts(params);
      await this.getData()
      if (data.length === 0) {
        this.spin.close()
        this.onCancel();
        this.hintMsg.success('全部导入成功')
      } else {
        this.errorData = data;
        this.modalKey = 'ADDS_ERROR'
      }
    } catch (error) {
      this.handleError(error);
    }
  }
  // 添加账号中
  private async addAccount(params: AddAccount) {
    this.spin.open('添加中')
    try {
      const res = await this.accMan.addAccount(params);
      await this.getData();
      this.onCancel();
      this.hintMsg.success(res.msg);
    } catch (error) {
      this.handleError(error)
    }
  }
  // 修改账号信息
  private async editAccount(params: EditAccount) {
    this.spin.open('修改中')
    try {
      const res = await this.accMan.editAccount(params);
      await this.getData();
      // this.spin.close();
      this.onCancel();
      this.hintMsg.success(res.msg);
    } catch (error) {
      this.handleError(error)
    }
  }

  async getData() {
    this.spin.open('正在获取数据');
    try {
      const data = await this.accMan.getAccountList(this.params);
      data.arr.forEach(v => v.eye = false)
      this.data = data;
      this.spin.close()
    } catch (error) {
      this.handleError(error)
    }
  }
  handleError(error) {
    this.spin.close();
  }

  pageIndexChange(e) {
    this.params.curPage = e;
    this.getData()
  }
  pageSizeChange(e) {
    this.params.perPage = e;
    this.getData()
  }
  onCancel() {
    this.visible = false;
    const timer = setTimeout(() => {
      this.modalKey = '';
      clearTimeout(timer)
    }, 100);
  }
  handleOpenModal(s: string, data?: AccountItem) {
    this.visible = true;
    this.modalKey = s;
    if (s === 'EDIT') {
      this.editData = data;
      this.byVal.sendMeg({ key: 'EDIT' })
    }
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.sub && this.sub.unsubscribe();
  }
}
