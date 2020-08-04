import { ComponentsModule } from 'src/app/components/components.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RoleRoutingModule } from './role-routing.module';
import { IndexComponent } from './index/index.component';
import { EditComponent } from './edit/edit.component';
import { AddComponent } from './add/add.component';
import { TaskSelectComponent } from './task-select/task-select.component';
import { TaskCopyComponent } from './task-copy/task-copy.component';
import { BatchEditComponent } from './batch-edit/batch-edit.component';


@NgModule({
  declarations: [IndexComponent, EditComponent, AddComponent, TaskSelectComponent, TaskCopyComponent, BatchEditComponent],
  imports: [
    CommonModule,
    RoleRoutingModule,
    ComponentsModule
  ]
})
export class RoleModule { }
