/***
 *@User chauncey
 *@Date 2019/10/14
 **/


interface configChildren {
  key: number;
  value: string;
}
export interface ConfigData {
  prefixUrl: string;
  dyUrl: string;
  authority: configChildren[];
  loginType: configChildren[];
  loginResult: configChildren[];
  taskEndStatus: configChildren[];
  taskStatus: configChildren[];
  jdLoginMethod: configChildren[];
  jdLoginStatus: configChildren[];
  jdLoginExecute: configChildren[];
  pullNewTpe: configChildren[];
  inputTpe: configChildren[];
  exportKey: configChildren[];
}

export class Config {
  public static data: ConfigData;

  public static prefixUrl() {
    return Config.data.prefixUrl;
  }
  public static dyUrl() {
    return Config.data.dyUrl;
  }
  public static get inputTpe() {
    return Config.data.inputTpe;
  }
  public static get exportKey() {
    return Config.data.exportKey;
  }
  public static get jdLoginMethod() {
    return Config.data.jdLoginMethod;
  }
  public static get pullNewTpe() {
    return Config.data.pullNewTpe;
  }
  public static get jdLoginStatus() {
    return Config.data.jdLoginStatus;
  }
  public static get jdLoginExecute() {
    return Config.data.jdLoginExecute;
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
