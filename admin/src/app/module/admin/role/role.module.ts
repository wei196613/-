import { ComponentsModule } from 'src/app/components/components.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RoleRoutingModule } from './role-routing.module';
import { IndexComponent } from './index/index.component';
import { EditComponent } from './edit/edit.component';
import { AddComponent } from './add/add.component';


@NgModule({
  declarations: [IndexComponent, EditComponent, AddComponent],
  imports: [
    CommonModule,
    RoleRoutingModule,
    ComponentsModule
  ]
})
export class RoleModule { }
