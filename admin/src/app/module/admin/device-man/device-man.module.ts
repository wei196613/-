import { ComponentsModule } from 'src/app/components/components.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DeviceManRoutingModule } from './device-man-routing.module';
import { DeviceComponent } from './device/device.component';
import { EidtComponent } from './eidt/eidt.component';
import { TransferComponent } from './transfer/transfer.component';
import { IndexComponent } from './index/index.component';
import { AllocationComponent } from './allocation/allocation.component';


@NgModule({
  declarations: [DeviceComponent, EidtComponent, TransferComponent, IndexComponent, AllocationComponent],
  imports: [
    CommonModule,
    DeviceManRoutingModule,
    ComponentsModule
  ]
})
export class DeviceManModule { }
