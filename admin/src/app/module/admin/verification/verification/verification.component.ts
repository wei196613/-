import { ByValueService } from 'src/app/services/by-value.service';
import { AdminService } from 'src/app/services/admin.service';
import { Component, OnInit } from '@angular/core';
import { GetInvitationCodeList, GetInvitationCodeListParams } from 'src/app/services/entity';
import { format } from "date-fns";
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-verification',
  templateUrl: './verification.component.html',
  styleUrls: ['./verification.component.less']
})
export class VerificationComponent implements OnInit {
  id: number;
  /***控制对话框的类型*/
  modalKey: string = null;
  /**控制对话框是否打开*/
  visible = false;
  selectAll = [
    {
      name: 'selestFirst', arr: [
        { value: null, label: '全部' },
        { value: 0, label: '普通' },
        { value: 1, label: '有限免费' }
      ],
      placeholder: '类型'
    },
    {
      name: 'selestTwo', arr: [
        { value: null, label: '全部' },
        { value: 1, label: '已使用' },
        { value: 0, label: '未使用' }
      ],
      placeholder: '是否使用'
    }
  ]
  private params: GetInvitationCodeListParams = {
    perPage: 10,
    curPage: 1
  }
  data: GetInvitationCodeList;
  sub: Subscription
  constructor(private admin: AdminService, private byVal: ByValueService) { }

  ngOnInit() {
    this.sub = this.byVal.getMeg().subscribe(res => {
      switch (res.key) {
        case 'title_query':
          this.titleQuery(res.data)
          break;
        case 'GET_INVITATION_CODE_LIST':
          this.data = res.data;
          break;
        case 'DELETE_INVITATION_CODE':
          this.visible = false;
          this.getData();
          break;
        default:
          break;
      }
    })
    this.getData();
  }
  // 查询
  private titleQuery(data) {
    this.params.curPage = 1;
    this.params.account = data.msg;
    this.params.category = data.selestFirst;
    if (data.selestTwo !== null && data.selestTwo !== undefined) {
      this.params.isUsed = !!data.selestTwo;
    } else {
      this.params.isUsed = null;
    }
    if (data.date && data.date.length > 1) {
      this.params.start = format(data.date[0], 'yyyy-MM-dd') + ' 00:00:00';
      this.params.end = format(data.date[1], 'yyyy-MM-dd') + ' 23:59:59';
    } else {
      this.params.start = null;
      this.params.end = null;
    }
    this.getData();
  }

  cancellation() {
    this.admin.deleteInvitationCode(this.id);
  }

  private getData() {
    this.admin.getInvitationCodeList(this.params);
  }

  pageIndexChange(e) {
    this.params.curPage = e;
    this.getData();
  }

  pageSizeChange(e) {
    this.params.perPage = e;
    this.getData();
  }
  getType(n: number) {
    return n ? '有限免费' : '普通'
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
  /**打开对话框*/
  handleOpenModal(key: string, id?: number) {
    this.id = id;
    this.modalKey = key;
    this.visible = true;
  }
  /**关闭对话框内的组件*/
  onCancel() {
    this.visible = false;
    const timer = setTimeout(() => {
      this.modalKey = '';
      clearTimeout(timer);
    }, 100);
  }
}
