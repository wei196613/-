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
  fakeDataUrl: string;
  Actiontpe: configChildren[];
  taskStatus: configChildren[];
  taskExecute: configChildren[];
  exportKey: configChildren[];
  deviceActivation: configChildren[];
}

export class Config {
  public static data: ConfigData;

  public static prefixUrl() {
    return Config.data.prefixUrl;
  }

  public static fakeDataUrl() {
    return Config.data.fakeDataUrl;
  }

  public static get Actiontpe() {
    return Config.data.Actiontpe;
  }

  public static get taskStatus() {
    return Config.data.taskStatus;
  }

  public static get taskExecute() {
    return Config.data.taskExecute;
  }
  public static get exportKey() {
    return Config.data.exportKey;
  }
  public static get deviceActivation() {
    return Config.data.deviceActivation;
  }
}
