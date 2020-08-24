import { ComponentsModule } from 'src/app/components/components.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SafetyRoutingModule } from './safety-routing.module';
import { IndexComponent } from './index/index.component';
import { OpenValidationComponent } from './open-validation/open-validation.component';
import { CloseValidationComponent } from './close-validation/close-validation.component';
import { InputPasswordComponent } from './input-password/input-password.component';
import { QRCodeModule } from 'angular2-qrcode';


@NgModule({
  declarations: [IndexComponent, OpenValidationComponent, CloseValidationComponent, InputPasswordComponent],
  imports: [
    CommonModule,
    SafetyRoutingModule,
    ComponentsModule,
    QRCodeModule
  ]
})
export class SafetyModule { }
