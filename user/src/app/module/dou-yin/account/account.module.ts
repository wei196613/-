import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccountRoutingModule } from './account-routing.module';
import { IndexComponent } from './index/index.component';
import { AddComponent } from './add/add.component';
import { EditComponent } from './edit/edit.component';
import { AddsComponent } from './adds/adds.component';
import { ComponentsModule } from 'src/app/components/components.module';


@NgModule({
  declarations: [IndexComponent, AddComponent, EditComponent, AddsComponent],
  imports: [
    CommonModule,
    AccountRoutingModule,
    ComponentsModule
  ]
})
export class AccountModule { }
