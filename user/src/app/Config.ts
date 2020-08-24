/***
 *@User chauncey
 *@Date 2019/10/14
 **/


interface configChildren {
  key: number;
  value: string;
}

export interface ConfigUrl {
  prefixUrl: string;
}

export interface ConfigData {
  prefixUrl: string;
  authority: configChildren[];
  loginType: configChildren[];
  loginResult: configChildren[];
  taskEndStatus: configChildren[];
  taskStatus: configChildren[];
  loginMethod: configChildren[];
  LoginStatus: configChildren[];
  loginExecute: configChildren[];
  pullNewTpe: configChildren[];
  inputTpe: configChildren[];
  exportKey: configChildren[];
  networkType: configChildren[];
  spiltList: configChildren[];
}

export class Config {
  public static data: ConfigData;

  public static prefixUrl() {
    return Config.data.prefixUrl;
  }
  public static get inputTpe() {
    return Config.data.inputTpe;
  }
  public static get exportKey() {
    return Config.data.exportKey;
  }
  public static get spiltList() {
    return Config.data.spiltList;
  }
  public static get networkType() {
    return Config.data.networkType;
  }
  public static get loginMethod() {
    return Config.data.loginMethod;
  }
  public static get pullNewTpe() {
    return Config.data.pullNewTpe;
  }
  public static get LoginStatus() {
    return Config.data.LoginStatus;
  }
  public static get loginExecute() {
    return Config.data.loginExecute;
  }
  public static get authority() {
    return Config.data.authority;
  }
  public static get loginType() {
    return Config.data.loginType
  }
  public static get loginResult() {
    return Config.data.loginResult
  }
  public static get taskEndStatus() {
    return Config.data.taskEndStatus
  }
  public static get taskStatus() {
    return Config.data.taskStatus
  }

}
