import { ComponentsModule } from 'src/app/components/components.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CouponRoutingModule } from './coupon-routing.module';
import { CouponComponent } from './coupon/coupon.component';
import { EditComponent } from './edit/edit.component';


@NgModule({
  declarations: [CouponComponent, EditComponent],
  imports: [
    CommonModule,
    CouponRoutingModule,
    ComponentsModule
  ]
})
export class CouponModule { }
