import { MenuItem } from './../../components/app-frame/app-frame.component';
import { Component, OnInit } from '@angular/core';

@Component({
  template: '<app-frame [menuItems]="items"></app-frame>'
})
export class MainComponent implements OnInit {
  items: MenuItem[];
  private base = '/admin';

  constructor() {
    this.items = [
      {
        title: '代理管理',
        path: `${this.base}/agent`,
        icon: 'usergroup-add'
      },
      {
        title: '角色权限',
        path: `${this.base}/role`,
        icon: 'usergroup-add'
      }, {
        title: '设备分配',
        path: `${this.base}/device`,
        icon: 'usergroup-add'
      },
      {
        title: '邀请码',
        path: `${this.base}/verification`,
        icon: 'cloud-server'
      },
      {
        title: 'action类型',
        path: `${this.base}/custom-action`,
        icon: 'interaction'
      },
      {
        title: '任务类型',
        path: `${this.base}/task-type`,
        icon: 'interaction'
      },
      {
        title: '任务记录',
        path: `${this.base}/task-record`,
        icon: 'interaction'
      },
      {
        title: '云控入口',
        path: `${this.base}/cloud-entrance`,
        icon: 'cloud'
      }, {
        title: '设备激活码',
        path: `${this.base}/device-activation`,
        icon: 'android'
      }
    ];
  }

  ngOnInit() {
  }
}
