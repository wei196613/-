import { ComponentsModule } from 'src/app/components/components.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CloudEntranceRoutingModule } from './cloud-entrance-routing.module';
import { IndexComponent } from './index/index.component';
import { EditComponent } from './edit/edit.component';


@NgModule({
  declarations: [IndexComponent, EditComponent],
  imports: [
    CommonModule,
    CloudEntranceRoutingModule,
    ComponentsModule
  ]
})
export class CloudEntranceModule { }
