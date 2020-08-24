import { Route } from "@angular/router";
export class CommonResp {
  status?: number;
  res: number | undefined;
  msg?: string;
  error?: any;
}

/* export enum AgentType {
  AGENT = 0,
  USER = 1
} */

export class Common<T> {
  total: number;
  arr: T[];
}

export interface UserInfo {
  id: number,
  account: string,
  permissions: number[];
  total: number,//总米币数
  token?: string,
  key?: string;
  freeList: [{  //限时米币列表
    amount: number,
    endTime: number //过期时间
  }];
  /**云控地址*/
  cloudEntranceAddress?: string;
  auths: {
    totp: boolean;
    loginTotp: boolean;
  }
}

export interface SelfRoute extends Route {
  name?: string
  children?: SelfRoute[]
}
