import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MyTaskRoutingModule } from './my-task-routing.module';
import { IndexComponent } from './index/index.component';
import { AddComponent } from './add/add.component';
import { ComponentsModule } from 'src/app/components/components.module';
import { InputTpeComponent } from './input-tpe/input-tpe.component';
import { TaskTpeComponent } from './task-tpe/task-tpe.component';
import { DeviceComponent } from './device/device.component';
import { AddsDetailComponent } from './adds-detail/adds-detail.component';
import { TableComponent } from './table/table.component';
import { ExportDataComponent } from './export-data/export-data.component';


@NgModule({
  declarations: [IndexComponent, AddComponent, InputTpeComponent, TaskTpeComponent, DeviceComponent, AddsDetailComponent, TableComponent, ExportDataComponent],
  imports: [
    CommonModule,
    MyTaskRoutingModule,
    ComponentsModule
  ]
})
export class MyTaskModule { }
