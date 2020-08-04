import { ComponentsModule } from 'src/app/components/components.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RunTaskRoutingModule } from './run-task-routing.module';
import { RunTaskComponent } from './run-task/run-task.component';
import { AddComponent } from './add/add.component';
import { EditComponent } from './edit/edit.component';
import { DyStatusPipe } from 'src/app/pipe/dy-status.pipe';
import { DetailsComponent } from './details/details.component';



@NgModule({
  declarations: [RunTaskComponent, AddComponent, EditComponent, DyStatusPipe, DetailsComponent],
  imports: [
    CommonModule,
    RunTaskRoutingModule,
    ComponentsModule
  ]
})
export class RunTaskModule { }
