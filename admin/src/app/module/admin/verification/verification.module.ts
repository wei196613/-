import { VerificationComponent } from './verification/verification.component';
import { ComponentsModule } from 'src/app/components/components.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VerificationRoutingModule } from './verification-routing.module';
import { RoleComponent } from './role/role.component';
import { AddComponent } from './add/add.component';
import { EditComponent } from './edit/edit.component';


@NgModule({
  declarations: [
    VerificationComponent,
    RoleComponent,
    AddComponent,
    EditComponent
  ],
  imports: [
    CommonModule,
    VerificationRoutingModule,
    ComponentsModule
  ]
})
export class VerificationModule { }
