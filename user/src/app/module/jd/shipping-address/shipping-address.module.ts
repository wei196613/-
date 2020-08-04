import { ComponentsModule } from 'src/app/components/components.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ShippingAddressRoutingModule } from './shipping-address-routing.module';
import { AddressComponent } from './address/address.component';
import { AddressEditComponent } from './address-edit/address-edit.component';
import { AddressAddComponent } from './address-add/address-add.component';
import { AddressLabelComponent } from './address-label/address-label.component';
import { AddressLabelAddComponent } from './address-label-add/address-label-add.component';
import { AddressLabelEditComponent } from './address-label-edit/address-label-edit.component';
import { AddressSuffixComponent } from './address-suffix/address-suffix.component';
import { AddressSuffixEditComponent } from './address-suffix-edit/address-suffix-edit.component';
import { AddressSuffixAddComponent } from './address-suffix-add/address-suffix-add.component';


@NgModule({
  declarations: [AddressComponent, AddressEditComponent, AddressAddComponent, AddressLabelComponent, AddressLabelAddComponent, AddressLabelEditComponent, AddressSuffixComponent, AddressSuffixEditComponent, AddressSuffixAddComponent],
  imports: [
    CommonModule,
    ShippingAddressRoutingModule,
    ComponentsModule
  ]
})
export class ShippingAddressModule { }
