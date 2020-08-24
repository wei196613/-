import { EmptyComponent } from 'src/app/empty/empty.component';
import { RegComponent } from 'src/app/components/reg/reg.component';
import { AuthGuardService } from 'src/app/services/guard/auth-guard.service';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from 'src/app/login/login.component';
import { ChangePasswordComponent } from 'src/app/components/change-password/change-password.component';
import { AppFrameComponent } from 'src/app/components/app-frame/app-frame.component';
import { MainComponent } from 'src/app/components/main.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'change-password', component: ChangePasswordComponent },
  { path: 'reg', component: RegComponent },
  {
    path: '', component: AppFrameComponent, canActivate: [AuthGuardService], children:
      [
        {
          path: 'dy', component: MainComponent, children: [
            {
              path: '',
              children: [
                { path: 'account', loadChildren: () => import('src/app/module/dou-yin/account/account.module').then(m => m.AccountModule) },
                { path: 'login', loadChildren: () => import('src/app/module/dou-yin/login/login.module').then(m => m.LoginModule) },
                { path: 'play', loadChildren: () => import('src/app/module/dou-yin/play/play.module').then(m => m.PlayModule) },
                { path: 'run-task', loadChildren: () => import('src/app/module/dou-yin/run-task/run-task.module').then(m => m.RunTaskModule) },
                { path: 'his-task', loadChildren: () => import('src/app/module/dou-yin/his-task/his-task.module').then(m => m.HisTaskModule) }
              ]
            }
          ], canActivate: [AuthGuardService]
        },
        {
          path: 'user-info',
          loadChildren: () => import('src/app/module/components/safety/safety.module').then(m => m.SafetyModule)
        },
        {
          path: 'delete-task',
          loadChildren: () => import('src/app/module/components/delete-task/delete-task.module').then(m => m.DeleteTaskModule)
        },
        {
          path: 'my-task',
          loadChildren: () => import('src/app/module/components/my-task/my-task.module').then(m => m.MyTaskModule)
        },
        {
          path: 'device',
          loadChildren: () => import('src/app/module/components/device/device.module').then(m => m.DeviceModule)
        },
        { path: '**', redirectTo: 'dy', pathMatch: 'full' }
      ]
  },
  { path: '**', component: EmptyComponent } // 路由重定向
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
