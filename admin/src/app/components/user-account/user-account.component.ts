import { Common } from './../../services/entity';
import { AppSpinService } from 'src/app/components/spin-mask/app-spin.service';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { HttpService } from 'src/app/services/http.service';

@Component({
  selector: 'app-user-account',
  templateUrl: './user-account.component.html',
  styleUrls: ['./user-account.component.less']
})
export class UserAccountComponent implements OnInit {
  @Output() idChange = new EventEmitter<UserAccountItem>();
  /**保存用户信息*/
  data: UserAccount;
  /**搜索用户信息*/
  params = {
    perPage: 10,
    curPage: 1,
    keysword: null
  }
  constructor(private http: HttpService, private spin: AppSpinService) { }

  ngOnInit() {
    this.getData()
  }

  /**
   * 关键字搜索
   */
  public handleTitleQuery(s: string) {
    this.params.keysword = s;
    this.params.perPage = 10;
    this.params.curPage = 1;
    this.getData();
  }

  /**
   * 重置搜索信息
   */
  handleReset() {
    this.params = {
      perPage: 10,
      curPage: 1,
      keysword: null
    }
  }
  handleTdClick(data: UserAccountItem) {
    this.idChange.emit(data);
  }
  async getData() {
    try {
      this.spin.open('获取数据中。。。');
      const data = await this.getUserAccountList(this.params);
      this.data = data;
      this.spin.close();
    } catch (error) {
      this.spin.close();
      console.log(error);
    }
  }
  /**
 * getUserAccountList
 * GET /getUserAccountList?perPage=int&curPage=Int&keyword?=string
 * 获取用户列表
 */
  private getUserAccountList(params: { perPage: number, curPage: number, keyword?: string }) {
    const url = this.http.getUrl('getUserAccountList?', params);
    return this.http.get<UserAccount>(url).toPromise();
  }
}

export interface UserAccountItem {
  id: number;
  account: string;
}

 interface UserAccount extends Common<UserAccountItem> {

}