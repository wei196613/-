import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HisTaskComponent } from './his-task/his-task.component';


const routes: Routes = [
  {path: '',component: HisTaskComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HisTaskRoutingModule { }
