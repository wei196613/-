
import { Component, OnInit } from '@angular/core';
import {
  AddressLabelItem,
  AddressList,
  AddressItem,
  AddressService,
  AddMultipleAddressRes,
  EditAddress,
  AddMultipleAddressParams,
  AddAddressLabel,
  EditAddressLabel,
  AddAddressSuffix,
  AddressSuffix
} from 'src/app/services/jd/address.service';
import { Subscription } from 'rxjs';
import { ByValueService } from 'src/app/services/by-value.service';
import { AppSpinService } from 'src/app/components/spin-mask/app-spin.service';
import { NzMessageService } from 'ng-zorro-antd';

@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.less']
})
export class AddressComponent implements OnInit {
  labelId: number;
  labelVisible = false; // 标签管理
  labelArr: AddressLabelItem[]; // 地址标签列表
  data: AddressList;
  checkData: AddressItem;// 选中要修改的地址
  sub: Subscription;
  addressSuffix: AddressSuffix[]
  visible = false;
  modalKey = '';
  addAddressError: AddMultipleAddressRes[]// 添加地址失败的提示信息
  params = {
    perPage: 10,
    curPage: 1,
    address: null,
    labelName: null
  } // 地址搜索条件
  constructor(private hintMsg: NzMessageService,
    private spin: AppSpinService,
    private byVal: ByValueService,
    private address: AddressService) { }

  ngOnInit() {
    this.getData();
    this.getAddressLabelAll();
    this.sub = this.byVal.getMeg().subscribe(res => {
      switch (res.key) {
        case 'add_address_start':
          this.addAddress(res.data)
          break;
        case 'edit_address_start':
          this.editAddress(res.data)
          break;
        case 'add_address_label_start':
          this.addAddressLabel(res.data)
          break;
        case 'edit_address_label_start':
          this.editAddressLabel(res.data)
          break;
        case 'edit_address_suffix_start':
          this.EditSuffix(res.data)
          break;
        case 'add_address_suffix_start':
          this.addSuffix(res.data)
          break;
      }
    })
  }

  handleQuery(msg: string) {
    this.params.address = msg;
    this.params.perPage = 10;
    this.params.curPage = 1;
    this.getData();
  }
  handleReset() {
    this.params = {
      perPage: 10,
      curPage: 1,
      address: null,
      labelName: null
    }
  }
  // 添加后缀标签
  async addSuffix(params: AddAddressSuffix) {
    this.spin.open('正在添加后缀标签')
    try {
      const res = await this.address.addAddressSuffixLabel(params);
      await this.getAddressSuffix();
      this.byVal.sendMeg({ key: 'add_address_suffix_success' })
      this.hintMsg.success(res.msg)
    } catch (error) {
      this.handleError(error)
    }
  }

  // 修改后缀标签
  async EditSuffix(params: AddressSuffix) {
    this.spin.open('正在修改后缀标签')
    try {
      const res = await this.address.editAddressSuffixLabel(params);
      await this.getAddressSuffix();
      this.byVal.sendMeg({ key: 'edit_address_suffix_success' })
      this.hintMsg.success(res.msg)
    } catch (error) {
      this.handleError(error)
    }
  }

  // 获取后缀标签
  async getAddressSuffix() {
    this.spin.open('正在获取地址后缀标签')
    try {
      const data = await this.address.getAddressSuffixLabelList();
      this.addressSuffix = data;
      this.spin.close()
    } catch (error) {
      this.handleError(error)
    }
  }

  // 添加地址标签
  async addAddressLabel(params: AddAddressLabel) {
    this.spin.open('正在添加收货地址标签');
    try {
      const res = await this.address.addAddressLabel(params);
      await this.getAddressLabelAll();
      this.byVal.sendMeg({ key: 'add_address_label_success' })
      this.hintMsg.success(res.msg)
    } catch (error) {
      this.handleError(error)
    }
  }
  // 修改地址标签
  async editAddressLabel(params: EditAddressLabel) {
    this.spin.open('正在添加收货地址标签');
    try {
      const res = await this.address.editAddressLabel(params);
      await this.getAddressLabelAll();
      this.byVal.sendMeg({ key: 'edit_address_label_success' })
      this.hintMsg.success(res.msg)
    } catch (error) {
      this.handleError(error)
    }
  }
  // addAddress 添加收货地址信息
  async  addAddress(params: AddMultipleAddressParams) {
    this.spin.open('正在添加收货地址');
    try {
      const res = await this.address.addMultipleAddress(params);
      await this.getData();
      if (res && res.length > 0) {
        this.modalKey = 'add_address_error';
        this.addAddressError = res;
      } else if (res && res.length === 0) {
        this.spin.close();
        // this.closeModal();
        this.onCancel();
        this.hintMsg.success('添加成功')
      }
    } catch (error) {
      this.handleError(error)
    }
  }
  // editAddress 修改收货地址信息
  async  editAddress(params: EditAddress) {
    this.spin.open('正在修改收货地址');
    try {
      const res = await this.address.editAddress(params);
      await this.getData();
      this.spin.close();
      // this.closeModal();
      this.onCancel();
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
  // 获取数据
  async getData() {
    this.spin.open('正在获取数据');
    try {
      const data = await this.address.getAddressList(this.params);
      this.data = data;
      this.spin.close()
    } catch (error) {
      this.handleError(error)
    }
  }
  // 获取标签列表
  async getAddressLabelAll() {
    this.spin.open('获取地址标签中');
    try {
      const data = await this.address.getAddressLabelList();
      this.labelArr = data;
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
    this.labelVisible = false;
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
    this.sub && this.sub.unsubscribe();
  }
  async handleOpenModal(s: string, data?: AddressItem) {
    if (s === 'open_address_label' || s === 'open_address_suffix') {
      if (s === 'open_address_label') {
        await this.getAddressLabelAll()
      } else if (s === 'open_address_suffix') {
        await this.getAddressSuffix()
      }
      this.labelVisible = true;
    } else {
      await this.getAddressLabelAll();
      await this.getAddressSuffix();
      this.visible = true;
    }
    this.modalKey = s;
    if (data) {
      this.checkData = data;
    }
  }
}
