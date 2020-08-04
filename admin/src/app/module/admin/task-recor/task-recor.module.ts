import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TaskRecorRoutingModule } from './task-recor-routing.module';
import { IndexComponent } from './index/index.component';
import { DetailsComponent } from './details/details.component';
import { ExportComponent } from './export/export.component';
import { ComponentsModule } from 'src/app/components/components.module';


@NgModule({
  declarations: [IndexComponent, DetailsComponent, ExportComponent],
  imports: [
    CommonModule,
    TaskRecorRoutingModule,
    ComponentsModule
  ]
})
export class TaskRecorModule { }
