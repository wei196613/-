import { HttpService } from '../http.service';
import { Common, CommonResp } from '../entity';
import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class DyPlayService {

  constructor(private http: HttpService) { }

  /**
   * getScripts
   * GET /getScripts?perPage=number&curPage=number&keyword?=string
   * 获取剧本列表
   */
  public getScripts(params: { perPage: number, curPage: number, keyword?: string }) {
    const url = this.http.getUrl('getScripts?', params);
    return this.http.dy_get<Scripts>(url);
  }

  /**
   * getComments
   * GET /getComments?scriptId=number&perPage?=number&curPage?=number
   * 获取某剧本中的发言列表
   */
  public getComments(params: { perPage: number, curPage: number, scriptId: number }) {
    const url = this.http.getUrl('getComments?', params);
    return this.http.dy_get<Comments>(url)
  }

  /**
   * addScript 
   * POST /addScript
   * 添加剧本
   * 
   */
  public addScript(params: AddScriptParams) {
    return this.http.dy_post<CommonResp>('addScript', params);
  }

  /**
   * parseScriptExcel
   * POST /parseScriptExcel
   * 解析剧本excel文件
   */
  public parseScriptExcel(excel: string) {
    return this.http.dy_post<ScriptExcel>('parseScriptExcel', { excel });
  }

  /**
   * editScript
   * POST /editScript
   * 修改剧本
   */
  public editScript(params: EditScriptParams) {
    return this.http.dy_post<CommonResp>('editScript', params);
  }

}
interface ScriptsItem {
  id: number,
  name: string,
  totalTime: number,
  characterNumber: number,
  commentNumber: number
}

interface Scripts extends Common<ScriptsItem> { }

interface CommentsItem {
  id: number,
  charactName: string,
  relativeTime: number,
  content: string
}

interface Comments extends Common<CommentsItem> { }

interface AddScriptParams {
  id: number,
  name: string,
  excelKey: number
}

interface ScriptExcelItem {
  id: number,
  characterName: string,
  relativeTime: number,
  content: string
}
interface ScriptExcel extends Common<ScriptExcelItem> {
  key: string,
  commentNumber: number,
  characterNumber: number,
  totalTime: number,
}

interface EditScriptParams {
  id: number,
  name: string,
  excelKey?: string
}

export {
  Scripts,
  EditScriptParams,
  ScriptExcel,
  AddScriptParams,
  CommentsItem,
  Comments,
  ScriptsItem
}