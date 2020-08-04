import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AccountManComponent } from './account-man/account-man.component';


const routes: Routes = [
  {
    path: '', component: AccountManComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountManRoutingModule { }
