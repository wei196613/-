import { ComponentsModule } from 'src/app/components/components.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IndexComponent } from './index/index.component';
import { EditComponent } from './edit/edit.component';
import { TransferComponent } from './transfer/transfer.component';
import { DeviceRoutingModule } from './device-routing.module';
import { ActiveComponent } from './active/active.component';


@NgModule({
  declarations: [
    IndexComponent,
    EditComponent,
    TransferComponent,
    ActiveComponent],
  imports: [
    CommonModule,
    DeviceRoutingModule,
    ComponentsModule
  ]
})
export class DeviceModule { }
