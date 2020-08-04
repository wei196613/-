import { Common, CommonResp } from '../entity';
import { AppSpinService } from 'src/app/components/spin-mask/app-spin.service';
import { HttpService } from '../http.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PullNewService {

  constructor(private http: HttpService) { }

  /**
   * getBonusUrlList  GET /getBonusUrlList?curPage=Int&perPage=Int&url?=String
   * 获取拉下地址
   */
  public getBonusUrlList(params: BonuserUrlListParams): Promise<BonuserUrlList> {
    const url = this.getUrl('jd/getBonusUrlList?', params)
    return this.http.get<BonuserUrlList>(url);
  }

  /**
   * addMultipleBonusUrl POST /addMultipleBonusUrl
   * 批量导入拉新地址
   */
  public addMultipleBonusUrl(params: MultipleBonusUrlParams): Promise<MultipleBonusUrl[]> {
    return this.http.post<MultipleBonusUrl[]>('jd/addMultipleBonusUrl', params)
  }

  /**
   * setBonuseUrl POST /setBonuseUrl 
   * disable 启用 false
   * disable 禁用 true
   */
  public setBonuseUrl(params: { id: number, disable: boolean }) {
    return this.http.post<CommonResp>('jd/setBonusUrl', params);
  }

  /**
   * editBonusUrl POST /editBonusUrl
   * 编辑拉新地址
   */
  public editBonusUrl(params: EditBonusUrl) {
    return this.http.post<CommonResp>('jd/editBonusUrl', params);
  }



  private getUrl(url: string, params) {
    for (const key in params) {
      if (params[key] !== null && params[key] !== undefined && params[key] !== '') {
        url += `${key}=${params[key]}&`
      }
    }
    return url.slice(0, -1);
  }

}

export interface BonuserUrlListParams {
  curPage: number;
  perPage: number;
  url?: string;
}

export interface BonuserUrlItem {
  id: number,
  url: string,
  tpe: number;
  maximum: number, //大于等于1000000表示无限制
  disableTime?: boolean //存在这个值表示被禁用

}

export interface BonuserUrlList extends Common<BonuserUrlItem> {

}

export interface MultipleBonusUrlParams {
  urls: string,
  maximum: number ////大于等于1000000表示无限制
}

export interface MultipleBonusUrl {
  line: string, //某一行内容
  error: string //出错信息
}

export interface EditBonusUrl {
  id: number,
  maximum: number;
}
