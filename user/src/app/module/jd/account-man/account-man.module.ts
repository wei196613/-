import { ComponentsModule } from 'src/app/components/components.module';
// import { MainComponent } from './main.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccountManRoutingModule } from './account-man-routing.module';
import { AccountManComponent } from './account-man/account-man.component';
import { EditComponent } from './edit/edit.component';
import { AddComponent } from './add/add.component';
import { AddsComponent } from './adds/adds.component';
import { AddsErrComponent } from './adds-err/adds-err.component';


@NgModule({
  declarations: [AccountManComponent, /* MainComponent */ EditComponent, AddComponent, AddsComponent, AddsErrComponent],
  imports: [
    CommonModule,
    AccountManRoutingModule,
    ComponentsModule
  ]
})
export class AccountManModule { }
