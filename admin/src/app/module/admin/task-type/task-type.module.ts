import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskTypeRoutingModule } from './task-type-routing.module';
import { IndexComponent } from './index/index.component';
import { AddComponent } from './add/add.component';
import { ComponentsModule } from 'src/app/components/components.module';
import { ActionComponent } from './action/action.component';
import { ActionTableComponent } from './action-table/action-table.component';
import { ActionEditComponent } from './action-edit/action-edit.component';
import { IsSelectComponent } from './is-select/is-select.component';
import { ParaSortComponent } from './para-sort/para-sort.component';
import { DragDropModule } from '@angular/cdk/drag-drop'

@NgModule({
  declarations: [IndexComponent, AddComponent, ActionComponent, ActionTableComponent, ActionEditComponent, IsSelectComponent, ParaSortComponent,],
  imports: [
    CommonModule,
    TaskTypeRoutingModule,
    ComponentsModule,
    DragDropModule
  ]
})
export class TaskTypeModule { }
