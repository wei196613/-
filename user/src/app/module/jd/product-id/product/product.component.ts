import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ByValueService } from 'src/app/services/by-value.service';
import { AppSpinService } from 'src/app/components/spin-mask/app-spin.service';
import { NzMessageService } from 'ng-zorro-antd';
import { ProductService, ProductList, ProductItem, AddProduct, AddsProductRes } from 'src/app/services/jd/product.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.less']
})
export class ProductComponent implements OnInit {
  visible = false;
  modalKey = 'OPEN_ADD'
  params = {
    perPage: 10,
    curPage: 1,
    priceStart: null,
    productId: null,
    priceEnd: null
  }
  sub: Subscription;
  data: ProductList;
  checkData: ProductItem;
  addsErr: AddsProductRes[]
  constructor(private hintMsg: NzMessageService, private spin: AppSpinService, private byVal: ByValueService, private product: ProductService) { }

  ngOnInit() {
    this.getData();
    this.sub = this.byVal.getMeg().subscribe(res => {
      switch (res.key) {
        case 'adds_start':
          this.adds(res.data)
          break;
        case 'add_start':
          this.add(res.data)
          break;
        case 'edit_start':
          this.edit(res.data)
          break;
      }
    })
  }

  handleQuery(productId){
    this.params.productId = productId;
    this.params.perPage = 10;
    this.params.curPage = 1;
    this.getData();
  }

  handleReset(){
    this.params = {
      perPage: 10,
      curPage: 1,
      priceStart: null,
      productId: null,
      priceEnd: null
    }
  }

  handleOpenModal(s: string, data?: ProductItem) {
    this.visible = true;
    this.modalKey = s;
    if (data) {
      this.checkData = data;
      // this.byVal.sendMeg({ key: 'EDIT' })
    }
  }
  // 单个添加商品ID
  async add(params: AddProduct) {
    this.spin.open('正在添加商品ID');
    try {
      const res = await this.product.addProduct(params);
      await this.getData();
      this.spin.close();
      this.onCancel()
      this.hintMsg.success(res.msg)
    } catch (error) {
      this.handleError(error)
    }
  }
  // 批量添加商品ID
  async adds(params: string) {
    this.spin.open('正在批量添加商品ID');
    try {
      const res = await this.product.addMultipleProduct(params);
      await this.getData();
      this.spin.close();
      if (res && res.length > 0) {
        this.addsErr = res;
        this.modalKey = 'adds_error';
      } else {
        this.hintMsg.success('添加成功')
        this.onCancel();
        // this.closeModal();
      }
    } catch (error) {
      this.handleError(error)
    }
  }
  // edit 修改商品信息
  async edit(params) {
    this.spin.open('正在修改商品ID');
    try {
      const res = await this.product.editProduct(params);
      await this.getData();
      this.spin.close();
      this.onCancel()
      this.hintMsg.success(res.msg)
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
  async getData() {
    this.spin.open('正在获取数据');
    try {
      const data = await this.product.getProductList(this.params);
      this.data = data;
      this.spin.close()
    } catch (error) {
      this.handleError(error)
    }
  }
  handleError(error) {
    this.spin.close();
  }
  // 重置按钮
  handdleReset() {
    this.params = {
      perPage: 10,
      curPage: 1,
      priceStart: null,
      productId: null,
      priceEnd: null
    }
  }
  onCancel() {
    this.visible = false;
    this.closeModal();
  }
  // 关闭弹框内的组件
  closeModal() {
    const timer = setTimeout(() => {
      this.modalKey = '';
      clearTimeout(timer);
    }, 100);
  }
  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
   this.sub &&  this.sub.unsubscribe();
  }
}
