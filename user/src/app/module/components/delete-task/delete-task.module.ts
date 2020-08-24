import { ExportComponent } from './export/export.component';
import { DetailsComponent } from './details/details.component';
import { ComponentsModule } from 'src/app/components/components.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeleteTaskRoutingModule } from './delete-task-routing.module';
import { IndexComponent } from './index/index.component';


@NgModule({
  declarations: [IndexComponent, ExportComponent, DetailsComponent],
  imports: [
    CommonModule,
    DeleteTaskRoutingModule,
    ComponentsModule
  ]
})
export class DeleteTaskModule { }
