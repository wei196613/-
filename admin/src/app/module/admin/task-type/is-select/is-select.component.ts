import { Subscription } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { ActionTypeNames, ActionTypeNameItem } from 'src/app/services/entity';
import { ByValueService } from 'src/app/services/by-value.service';

@Component({
  selector: 'app-is-select',
  templateUrl: './is-select.component.html',
  styleUrls: ['./is-select.component.less']
})
export class IsSelectComponent implements OnInit {
  /**保存数据库里的数据*/
  data: ActionTypeNames;
  /**保存选中转台变化的任务id*/
  ids: number[] = [];
  /**是否打开提示框*/
  visible = false;
  /**保存查询任务的参数*/
  params = {
    perPage: 30,
    curPage: 1,
    keyword: null
  }
  sub: Subscription;
  /**是否选中*/
  getIsChecked(id: number) {
    return this.ids.findIndex(v => v === id)
  }
  constructor(private byVal: ByValueService) { }

  ngOnInit() {
    this.sub = this.byVal.getMeg().subscribe(res => {
      if (res.key === 'get_task_checkedbox_success') {
        this.data = res.data;
      }
    })
    this.getData();
  }
  handleTitleQuery(keyword: string) {
    this.params = {
      perPage: 30,
      curPage: 1,
      keyword
    }
    this.getData()
  }
  handleTitleClear() {
    this.params = {
      perPage: 30,
      curPage: 1,
      keyword: null
    }
  }
  getChecked({ id, defaultVisible }: ActionTypeNameItem) {
    const index = this.getIsChecked(id);
    if (index != -1 && defaultVisible) {
      return false;
    } else if (index != -1 || defaultVisible) {
      return true;
    } else {
      return false;
    }
  }
  checkboxChange(id: number) {
    const index = this.getIsChecked(id)
    index != -1 ? this.ids.splice(index, 1) : this.ids.push(id)
  }

  getData() {
    this.byVal.sendMeg({ key: 'task_checkbox_query', data: this.params })
  }
  ngOnDestroy(): void {
    this.sub && this.sub.unsubscribe()
  }
  submitForm() {
    if (this.visible) {
      this.byVal.sendMeg({ key: 'edit_task_visible', data: this.ids })
      return;
    } else {
      if (this.ids.length > 0) {
        this.onCancel();
      } else {
        this.byVal.sendMeg({ key: 'colse_modal' })
      }
    }
  }
  onCancel() {
    this.visible = !this.visible;
  }
}
