import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HisTaskRoutingModule } from './his-task-routing.module';
import { HisTaskComponent } from './his-task/his-task.component';
import { HisTaskDetailsComponent } from './his-task-details/his-task-details.component';
import { ComponentsModule } from 'src/app/components/components.module';


@NgModule({
  declarations: [HisTaskComponent, HisTaskDetailsComponent],
  imports: [
    CommonModule,
    HisTaskRoutingModule,
    ComponentsModule
  ]
})
export class HisTaskModule { }
