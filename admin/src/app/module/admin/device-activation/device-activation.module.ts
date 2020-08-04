import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeviceActivationRoutingModule } from './device-activation-routing.module';
import { ComponentsModule } from 'src/app/components/components.module';
import { EditComponent } from './edit/edit.component';
import { IndexComponent } from './index/index.component';


@NgModule({
  declarations: [EditComponent, IndexComponent],
  imports: [
    CommonModule,
    DeviceActivationRoutingModule,
    ComponentsModule
  ]
})
export class DeviceActivationModule { }
