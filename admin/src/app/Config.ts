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
}
