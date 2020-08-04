import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductIdRoutingModule } from './product-id-routing.module';
import { ProductComponent } from './product/product.component';
import { AddComponent } from './add/add.component';
import { AddsComponent } from './adds/adds.component';
import { ComponentsModule } from 'src/app/components/components.module';
import { EditComponent } from './edit/edit.component';
import { AddsErrComponent } from './adds-err/adds-err.component';


@NgModule({
  declarations: [ProductComponent, AddComponent, AddsComponent, EditComponent, AddsErrComponent],
  imports: [
    CommonModule,
    ProductIdRoutingModule,
    ComponentsModule
  ]
})
export class ProductIdModule { }
