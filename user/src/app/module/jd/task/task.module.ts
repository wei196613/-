import { ComponentsModule } from 'src/app/components/components.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TaskRoutingModule } from './task-routing.module';
import { TaskComponent } from './task/task.component';
import { TaskDetailComponent } from './task-detail/task-detail.component';
import { CopyComponent } from './copy/copy.component';


@NgModule({
  declarations: [TaskComponent, TaskDetailComponent, CopyComponent],
  imports: [
    CommonModule,
    TaskRoutingModule,
    ComponentsModule
  ]
})
export class TaskModule { }
