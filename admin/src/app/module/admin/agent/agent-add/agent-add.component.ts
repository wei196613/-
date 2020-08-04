import { ByValueService } from 'src/app/services/by-value.service';
import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-agent-add',
  templateUrl: './agent-add.component.html',
  styleUrls: ['./agent-add.component.less']
})
export class AgentAddComponent implements OnInit {
  account: string;
  password: string;
  isAddSuccess = true;
  sub: Subscription;

  constructor(private byVal: ByValueService) { }

  ngOnInit() {
    this.sub = this.byVal.getMeg().subscribe(res => {
      switch (res.key) {
        case 'CREATE_AGENT':
          this.password = res.data.pwd;
          this.isAddSuccess = false;
          break;
        case 'OPEN_ADD':
          this.password = null;
          this.account = null;
          this.isAddSuccess = true;
          break;
      }
    })
  }
  /**
   * agentAddSuccess 添加成功
   */
  public agentAddSuccess() {

  }
  /**
   * handleAdd 添加账号
   */
  public handleAdd() {
    this.byVal.sendMeg({ key: 'AGENT_ADD', data: { account: this.account } })
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
  get tipText() {
    return `账号：${this.account};密码：${this.password}`;
  }
}
