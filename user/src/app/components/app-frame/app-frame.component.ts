import { LoginService } from 'src/app/services/login.service';

import { Component, Input } from '@angular/core';
import { Router } from "@angular/router";
import { UserInfoService } from 'src/app/services/userInfo.service';
// import { Config } from "../../Config";

@Component({
  selector: 'app-frame',
  templateUrl: './app-frame.component.html',
  styleUrls: ['./app-frame.component.less']
})
export class AppFrameComponent {
  nzOpen = 0;
  private dyMenuitems = [
    {
      title: '账号管理',
      name: "抖音账号管理",
      path: `/dy/account`,
      icon: 'user'
    },
    {
      title: '剧本管理',
      name: "抖音剧本管理",
      path: `/dy/play`,
      icon: 'solution'
    },
    {
      title: '登录任务',
      name: "抖音登录任务",
      path: `/dy/login`,
      icon: 'login'
    },
    {
      title: '直播任务',
      name: "抖音直播任务",
      path: `/dy/run-task`,
      icon: 'container'
    },
    {
      title: '历史任务',
      name: '抖音历史任务',
      path: `/dy/his-task`,
      icon: 'control'
    }
  ];

  private jdMenuitems = [
    {
      title: '京东账号',
      name: '京东账号管理',
      path: `/jd/account-man`,
      icon: 'usergroup-add'
    },
    {
      title: '拉新地址',
      name: '京东拉新地址',
      path: `/jd/pull-new`,
      icon: 'api'
    },
    {
      title: '收货地址',
      name: '京东收货地址',
      path: `/jd/shipping-address`,
      icon: 'environment'
    },
    {
      title: '商品ID',
      name: '京东商品ID',
      path: `/jd/product-id`,
      icon: 'shopping'
    },
    {
      title: '优惠券',
      name: '京东优惠券',
      path: `/jd/coupon`,
      icon: 'property-safety'
    },
    {
      title: '运行方案',
      name: '京东运行方案',
      path: `/jd/operation-scheme`,
      icon: 'container'
    },
    {
      title: '任务查询',
      name: '京东任务查询',
      path: `/jd/task`,
      icon: 'control'
    }
  ];

  private commonMenuitems = [
    {
      title: '设备管理',
      name: "设备管理",
      path: `/device`,
      icon: 'shake'
    }, {
      title: '我的任务',
      name: "我的任务",
      path: `/my-task`,
      icon: 'shake'
    }
  ]

  menuItem: { common: MenuItem[], jd: MenuItem[], dy: MenuItem[] } = {
    common: [],
    jd: [],
    dy: []
  }

  constructor(public router: Router, public userInfo: UserInfoService, public login: LoginService) {

  }

  ngOnInit(): void {
    this.menuItem.jd = this.handleFilterRouter(this.jdMenuitems);
    this.menuItem.dy = this.handleFilterRouter(this.dyMenuitems);
    this.menuItem.common = this.handleFilterRouter(this.commonMenuitems);
    if (this.handleIsCollapsed('/jd')) {
      this.nzOpen = 1;
    } else if (this.handleIsCollapsed('/dy')) {
      this.nzOpen = 2
    }
  }

  private handleFilterRouter(arr: MenuItem[]) {
    if (this.userInfo.authority) {
      return arr.filter(({ name }) => this.userInfo.authority.some(({ key, value }) => {
        if (name === '抖音历史任务') {
          return key === 2 || key === 4;
        }
        return value === name
      }
      ))
    }
    return []
  }
  navigate(path: string) {
    if (path) {
      this.router.navigate([path]);
    }
  }
  // 打开当前路由的导航栏
  handleIsCollapsed(s: string) {
    const url = this.router.url;
    const reg = RegExp(`^${s}`);
    return reg.test(url)
  }

  get IsAuth() {
    let i = 0;
    for (const v in this.menuItem) {
      if (this.menuItem[v].length === 0) {
        ++i
      }
    }
    return i === 3
  }
}

export interface MenuItem {
  title: string;
  path?: string;
  icon?: string;
  name?: string;
}
