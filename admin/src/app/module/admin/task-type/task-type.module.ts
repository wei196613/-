import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TaskTypeRoutingModule } from './task-type-routing.module';
import { IndexComponent } from './index/index.component';
import { AddComponent } from './add/add.component';
import { EditComponent } from './edit/edit.component';
import { ComponentsModule } from 'src/app/components/components.module';
import { ActionComponent } from './action/action.component';
import { ActionTableComponent } from './action-table/action-table.component';
import { ActionEditComponent } from './action-edit/action-edit.component';


@NgModule({
  declarations: [IndexComponent, AddComponent, EditComponent, ActionComponent, ActionTableComponent, ActionEditComponent, ],
  imports: [
    CommonModule,
    TaskTypeRoutingModule,
    ComponentsModule
  ]
})
export class TaskTypeModule { }
