import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomActionRoutingModule } from './custom-action-routing.module';
import { IndexComponent } from './index/index.component';
import { EditComponent } from './edit/edit.component';
import { AddComponent } from './add/add.component';
import { ComponentsModule } from 'src/app/components/components.module';


@NgModule({
  declarations: [IndexComponent, EditComponent, AddComponent],
  imports: [
    CommonModule,
    CustomActionRoutingModule,
    ComponentsModule
  ]
})
export class CustomActionModule { }
