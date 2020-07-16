import { ComponentsModule } from 'src/app/components/components.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OperationSchemeRoutingModule } from './operation-scheme-routing.module';
import { OperationSchemeComponent } from './operation-scheme/operation-scheme.component';
import { AddComponent } from './add/add.component';
import { EditComponent } from './edit/edit.component';


@NgModule({
  declarations: [OperationSchemeComponent, AddComponent, EditComponent],
  imports: [
    CommonModule,
    OperationSchemeRoutingModule,
    ComponentsModule
  ]
})
export class OperationSchemeModule { }
