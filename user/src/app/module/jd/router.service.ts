import { SelfRoute } from 'src/app/services/entity';
import { Injectable } from '@angular/core';
import { UserInfoService } from 'src/app/services/userInfo.service';
import { Routes } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class RouterService {
  private routerArr: SelfRoute[] = [
    { path: 'account-man', name: '京东账号管理', loadChildren: () => import('src/app/module/jd/account-man/account-man.module').then(m => m.AccountManModule) },
    { path: 'pull-new', name: '京东拉新地址', loadChildren: () => import('src/app/module/jd/pull-new/pull-new.module').then(m => m.PullNewModule) },
    { path: 'shipping-address', name: '京东收货地址', loadChildren: () => import('src/app/module/jd/shipping-address/shipping-address.module').then(m => m.ShippingAddressModule) },
    { path: 'product-id', name: '京东商品ID', loadChildren: () => import('src/app/module/jd/product-id/product-id.module').then(m => m.ProductIdModule) },
    { path: 'coupon', name: '京东优惠券', loadChildren: () => import('src/app/module/jd/coupon/coupon.module').then(m => m.CouponModule) },
    { path: 'operation-scheme', name: '京东运行方案', loadChildren: () => import('src/app/module/jd/operation-scheme/operation-scheme.module').then(m => m.OperationSchemeModule) },
    // { path: 'device-man', name: '设备管理', loadChildren: 'src/app/components/device/device.module#DeviceModule) },
  ]

  constructor(private user: UserInfoService) { }

  get routerCogfig(): Routes {
    const authRouter = this.routerArr.filter(({ name }) => this.user.authority.some(({ value }) => value === name))
    if (authRouter.length === 0) return [];
    authRouter.push({ path: '**', redirectTo: authRouter[0].path, pathMatch: 'full' });
    return authRouter
  }
}
