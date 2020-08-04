import { AccountItem, Account } from 'src/app/services/dy/dy-account.service';
import { Subscription } from 'rxjs';
import { Component, OnInit, Input } from '@angular/core';
import { NzTableComponent } from 'ng-zorro-antd';
import { ByValueService } from 'src/app/services/by-value.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.less']
})
export class AccountComponent implements OnInit {
  checkAll = [
    { value: 1, label: 'QQ', checked: false },
    { value: 2, label: '微博', checked: false },
    { value: 3, label: '手机号', checked: false }
  ]
  @Input() data: Account;
  // @Output() dataChange = new EventEmitter<DevicesItem[]>();
  sub: Subscription;
  params = {
    perPage: 10,
    curPage: 1,
    keyword: null
  }; // 从数据库拉取账号所需参数
  constructor(private byVal: ByValueService) { }

  ngOnInit() {
  }
  handleQuery(keyword: string) {
    this.params = {
      perPage: 10,
      curPage: 1,
      keyword
    }
    this.byVal.sendMeg({ key: 'account_query', data: this.params })
  }
  handleReset() {
    this.params = {
      perPage: 10,
      curPage: 1,
      keyword: null
    }
  }
  handleMake() {
    this.byVal.sendMeg({ key: 'account_make', data: this.data })
  }
  pageIndexChange(e: number) {
    this.params.curPage = e;
    this.byVal.sendMeg({ key: 'account_query', data: this.params })
  }
  tableCheckAll(e: boolean) {
    this.data.arr.forEach(v => v.checked = e)
  }
  handleCheck(e: boolean, i: number) {
    this.data[i].checked = e;
  }
  // 选择全部
  get allChecked() {
    if (!this.data || this.data.arr.length === 0) return false;
    return this.data.arr.every(({ checked }) => checked === true);
  }
  // 部分有选中
  get indeterminate() {
    if (!this.data) return false;
    return this.data.arr.some(({ checked }) => checked === true) && !this.allChecked;
  }
  ngOnDestroy(): void {
    this.sub && this.sub.unsubscribe();
  }
}
