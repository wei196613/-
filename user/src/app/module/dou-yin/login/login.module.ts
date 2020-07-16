import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoginRoutingModule } from './login-routing.module';
import { IndexComponent } from './index/index.component';
import { AddComponent } from './add/add.component';
import { AccountComponent } from './account/account.component';
import { ComponentsModule } from 'src/app/components/components.module';
import { DeviceComponent } from './device/device.component';


@NgModule({
  declarations: [IndexComponent, AddComponent, AccountComponent, DeviceComponent],
  imports: [
    CommonModule,
    LoginRoutingModule,
    ComponentsModule
  ]
})
export class LoginModule { }
