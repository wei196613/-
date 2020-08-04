import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ByValueService } from 'src/app/services/by-value.service';
import { AppSpinService } from 'src/app/components/spin-mask/app-spin.service';
import { NzMessageService } from 'ng-zorro-antd';
import {
  DyPlayService,
  Comments,
  ScriptsItem,
  Scripts,
  ScriptExcel,
  AddScriptParams,
  EditScriptParams
} from 'src/app/services/dy/dy-play.service';
@Component({
  selector: 'app-play',
  templateUrl: './play.component.html',
  styleUrls: ['./play.component.less']
})
export class PlayComponent implements OnInit {
  data: Scripts;
  checkData: ScriptsItem;
  excel: ScriptExcel;
  sub: Subscription;
  comments: Comments;
  visible = false;
  modalKey = ''
  params = {
    perPage: 10,
    curPage: 1,
    keyword: null
  }
  constructor(private hintMsg: NzMessageService, private spin: AppSpinService, private byVal: ByValueService, private play: DyPlayService) { }

  ngOnInit() {
    this.getData();
    this.sub = this.byVal.getMeg().subscribe(res => {
      switch (res.key) {
        case 'add_start':
          this.add(res.data)
          break;
        case 'edit_start':
          this.edit(res.data)
          break;
        case 'parse_script_excel':
          this.parseScriptExcel(res.data)
          break;
        case 'more_comments':
          this.getComments(this.checkData.id, res.data)
          break;
      }
    })
  }

  handleQuery(msg: string) {
    this.params.keyword = msg;
    this.params.perPage = 10;
    this.params.curPage = 1;
    this.getData();
  }

  handleReset() {
    this.params = {
      perPage: 10,
      curPage: 1,
      keyword: null
    }
  }
  // 添加剧本
  async add(params: AddScriptParams) {
    this.spin.open('正在添加剧本');
    try {
      const res = await this.play.addScript(params)
      await this.getData();
      this.excel = null;
      this.onCancel();
      this.hintMsg.success(res.msg)
    } catch (error) {
      this.handleError(error)
    }
  }
  // edit 修改剧本
  async edit(params: EditScriptParams) {
    console.log('开始修改');

    this.spin.open('正在修改剧本');
    try {
      const res = await this.play.editScript(params)
      await this.getData();
      this.onCancel();
      this.excel = null;
      this.checkData = null;
      this.comments = null;
      this.hintMsg.success(res.msg)
    } catch (error) {
      this.handleError(error)
    }
  }
  // 获取剧本的发言列表
  async getComments(scriptId: number, curPage = 1) {
    this.spin.open('获取发言列表中');
    try {
      const data = await this.play.getComments({ scriptId, perPage: 10, curPage });
      this.comments = data;
      this.spin.close();
    } catch (error) {
      this.handleError(error)
    }
  }
  // parseScriptExcel 解析Excel表
  async parseScriptExcel(base64: string) {
    this.spin.open('正在解析Excel表');
    try {
      const data = await this.play.parseScriptExcel(base64);
      this.excel = data;
      this.spin.close();
      this.hintMsg.success('解析成功')
    } catch (error) {
      this.handleError(error)
    }
  }
  pageIndexChange(e) {
    this.params.curPage = e;
    this.getData()
  }
  pageSizeChange(e) {
    this.params.perPage = e;
    this.getData()
  }
  // 获取数据
  async getData() {
    this.spin.open('正在获取数据');
    try {
      const data = await this.play.getScripts(this.params);
      this.data = data;
      this.spin.close()
    } catch (error) {
      this.handleError(error)
    }
  }
  // 错误处理
  handleError(error) {
    this.spin.close();
  }
  onCancel() {
    this.visible = false;
    this.closeModal();
  }
  // 关闭弹框内的组件
  closeModal() {
    this.excel = null;
    this.comments = null;
    const timer = setTimeout(() => {
      this.modalKey = '';
      clearTimeout(timer);
    }, 100);
  }
  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.sub && this.sub.unsubscribe();
  }
  handleOpenModal(s: string, data?: ScriptsItem) {
    this.visible = true;
    this.modalKey = s;
    if (data && s === 'open_edit') {
      this.checkData = data;
      this.getComments(data.id);
    }
  }
}
