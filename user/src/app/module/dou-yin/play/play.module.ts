import { ComponentsModule } from 'src/app/components/components.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PlayRoutingModule } from './play-routing.module';
import { PlayComponent } from './play/play.component';
import { AddComponent } from './add/add.component';
import { EditComponent } from './edit/edit.component';


@NgModule({
  declarations: [PlayComponent, AddComponent, EditComponent],
  imports: [
    CommonModule,
    PlayRoutingModule,
    ComponentsModule
  ]
})
export class PlayModule { }
