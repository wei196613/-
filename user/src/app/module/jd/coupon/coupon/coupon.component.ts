
import { Component, OnInit } from '@angular/core';
import { ByValueService } from 'src/app/services/by-value.service';
import { AppSpinService } from 'src/app/components/spin-mask/app-spin.service';
import { NzMessageService } from 'ng-zorro-antd';
import { Subscription } from 'rxjs';
import { CouponService, CouponList, CouponItem, EditCouponParams, categoryArr } from 'src/app/services/jd/coupon.service';
@Component({
  selector: 'app-coupon',
  templateUrl: './coupon.component.html',
  styleUrls: ['./coupon.component.less']
})
export class CouponComponent implements OnInit {

  visible = false;
  data: CouponList;
  checkData: CouponItem
  categoryArr = categoryArr;
  params = {
    perPage: 10,
    curPage: 1,
    coupon: null
  }
  sub: Subscription
  constructor(private coupon: CouponService, private hintMsg: NzMessageService, private spin: AppSpinService, private byVal: ByValueService) { }

  async  getData() {
    this.spin.open('获取数据中')
    try {
      const data = await this.coupon.getCouponList(this.params);
      this.data = data;
      this.spin.close();
    } catch (error) {
      this.handleError(error)
    }
  }


  async eidt(params: EditCouponParams) {
    this.spin.open('正在修改中');
    try {
      const res = await this.coupon.edit(params);
      this.byVal.sendMeg({ key: 'edit_coupon_success' })
      await this.getData()
      this.onCancel();
      this.hintMsg.success(res.msg)
    } catch (error) {
      this.handleError(error)
    }
  }

  ngOnInit() {
    this.getData();
    this.sub = this.byVal.getMeg().subscribe(res => {
      switch (res.key) {
        case 'coupon_edit':
          this.eidt(res.data)
          break;
      }
    })
  }

  handleQuery(coupon: string) {
    this.params = {
      perPage: 10,
      curPage: 1,
      coupon
    }
    this.getData()
  }

  handleReset() {
    this.params = {
      perPage: 10,
      curPage: 1,
      coupon: null
    }
  }


  getCateText(n: number) {
    if (n >= 0) {
      return this.categoryArr.find(({ value }) => value === n).label;
    }
  }
  handleOpenModal(data: CouponItem) {
    this.checkData = data;
    this.byVal.sendMeg({ key: 'open_coupon_edit', data })
    this.visible = true;
  }
  onCancel() {
    this.visible = false;
  }
  pageSizeChange(e) {
    this.params.perPage = e;
    this.getData();
  }
  pageIndexChange(e) {
    this.params.curPage = e;
    this.getData();
  }
  handleError(error) {
    this.spin.close();
  }
  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.sub && this.sub.unsubscribe();
  }
}
