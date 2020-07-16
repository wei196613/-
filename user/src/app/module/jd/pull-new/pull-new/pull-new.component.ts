import { ByValueService } from 'src/app/services/by-value.service';
import { AppSpinService } from 'src/app/components/spin-mask/app-spin.service';
import { NzMessageService } from 'ng-zorro-antd';
import { Component, OnInit } from '@angular/core';
import { PullNewService, BonuserUrlList, MultipleBonusUrlParams, MultipleBonusUrl, EditBonusUrl, BonuserUrlItem } from 'src/app/services/jd/pullNew.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-pull-new',
  templateUrl: './pull-new.component.html',
  styleUrls: ['./pull-new.component.less']
})
export class PullNewComponent implements OnInit {
  visible: boolean = false; // 是否弹框 
  modalKey: string; // 控制弹出的框的内容
  msg: string;
  data: BonuserUrlList;
  eidtData: EditBonusUrl;
  multipleBonusUrl: MultipleBonusUrl[]; // 批量导入出错的数组
  params = {
    perPage: 10,
    curPage: 1,
    url: null
  }

  sub: Subscription;
  constructor(private pullNew: PullNewService, private hintMsg: NzMessageService, private spin: AppSpinService, private byVal: ByValueService) { }

  ngOnInit() {
    this.getData();
    this.sub = this.byVal.getMeg().subscribe(res => {
      switch (res.key) {
        case 'ADD_START':
          console.log(res.data);
          this.addMultipleBonusUrl(res.data);
          break;
        case 'EDIT_START':
          this.editBonusUrl(res.data)
          break;
      }
    })
  }
  handleQuery(url) {
    this.params = {
      perPage: 10,
      curPage: 1,
      url
    }
    this.getData()
  }
  handleReset() {
    this.params = {
      perPage: 10,
      curPage: 1,
      url: null
    }
  }
  // 从服务器端获取拉新地址数据
  async getData() {
    this.spin.open('获取数据中')
    try {
      const data = await this.pullNew.getBonusUrlList(this.params);
      this.data = data;
      this.spin.close();
      return data;
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * 批量导入拉新地址
   */
  private async addMultipleBonusUrl(params: MultipleBonusUrlParams) {
    this.spin.open('正在导入中')
    try {
      console.log(params);
      const data = await this.pullNew.addMultipleBonusUrl(params);
      await this.getData()
      if (data.length === 0) {
        this.spin.close()
        this.onCancel();
        this.hintMsg.success('全部导入成功')
      } else {
        this.multipleBonusUrl = data;
        this.modalKey = 'MULTIPLE_BONUS_URL'
      }
    } catch (error) {
      this.handleError(error);
    }
  }
  // 修改拉新地址
  private async editBonusUrl(params: EditBonusUrl) {
    this.spin.open('修改中')
    try {
      const res = await this.pullNew.editBonusUrl(params);
      await this.getData();
      this.spin.close();
      this.onCancel();
      this.hintMsg.success(res.msg);
    } catch (error) {
      this.handleError(error)
    }
  }
  // 错误处理
  private handleError(error) {
    this.spin.close();
    
  }

  handleOpenModal(key: string, data?: EditBonusUrl) {
    this.modalKey = key;
    this.visible = true;
    if (data) {
      this.eidtData = data;
    }
    // this.byVal.sendMeg({ key });
  }
  pageIndexChange(e) {
    this.params.curPage = e;
    this.getData()
  }
  pageSizeChange(e) {
    this.params.perPage = e;
    this.getData()
  }
  async handleConfirm(data: BonuserUrlItem) {
    if (data.disableTime) {
      this.spin.open('启用中')
    } else {
      this.spin.open('禁用中')
    }

    try {
      const res = await this.pullNew.setBonuseUrl({ id: data.id, disable: !data.disableTime });
      await this.getData();
      this.spin.close();
      this.onCancel();
      this.hintMsg.success(res.msg);
    } catch (error) {
      this.handleError(error)
    }
  }
  onCancel() {
    const timer = setTimeout(() => {
      this.modalKey = '';
      clearTimeout(timer);
    }, 100);
    this.visible = false;
  }
  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.sub && this.sub.unsubscribe();
  }
}
