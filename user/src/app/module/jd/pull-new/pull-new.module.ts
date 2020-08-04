import { ComponentsModule } from 'src/app/components/components.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PullNewRoutingModule } from './pull-new-routing.module';
import { PullNewComponent } from './pull-new/pull-new.component';
import { AddComponent } from './add/add.component';
import { EditComponent } from './edit/edit.component';


@NgModule({
  declarations: [PullNewComponent, AddComponent, EditComponent],
  imports: [
    CommonModule,
    PullNewRoutingModule,
    ComponentsModule
  ]
})
export class PullNewModule { }
