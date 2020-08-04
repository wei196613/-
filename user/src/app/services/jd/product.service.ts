import { Common, CommonResp } from '../entity';

import { HttpService } from '../http.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private http: HttpService) { }

  /**
   * getProductList GET /getProductList?curPage=number&perPage=number&productId?=string&priceStart?=string&priceEnd?=string
   * 获取商品列表
   */
  public getProductList(params: { curPage: number, perPage: number, productId: string, priceStart: string, priceEnd: string }) {
    const url = this.http.getUrl('jd/getProductList?', params);
    return this.http.get<ProductList>(url);
  }

  /**
   * addProduct POST /addProduct
   * 添加商品
   */
  public addProduct(params: AddProduct) {
    return this.http.post<CommonResp>('jd/addProduct', params);
  }

  /**
   * addMultipleProduct POST /addMultipleProduct
   * 批量添加商品
   */
  public addMultipleProduct(products: string) {
    return this.http.post<AddsProductRes[]>('jd/addMultipleProduct', { products });
  }

  /**
   * editProduct POST /editProduct
   * 编辑商品信息
   */
  public editProduct(params: { id: number; productId: string; price?: string }) {
    return this.http.post<CommonResp>('jd/editProduct', params);
  }
}

export interface ProductList extends Common<ProductItem> { }

export interface ProductItem {
  id: number,
  productId: string,
  price?: string
}

export interface AddProduct {
  productId: string,
  price?: string
}

export interface AddsProductRes {
  line: string, //某一行内容
  error: string //出错信息
}

