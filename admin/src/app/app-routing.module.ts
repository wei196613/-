import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { AuthGuardService } from './services/guard/auth-guard.service';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';


const routes: Routes = [
  { path: 'admin', loadChildren: () => import('./module/admin/admin.module').then(mod => mod.AdminModule), canActivate: [AuthGuardService] },
  { path: 'login', component: LoginComponent },
  { path: 'change-password', component: ChangePasswordComponent },
  { path: '**', redirectTo: 'admin', pathMatch: 'full' } // 路由重定向
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
