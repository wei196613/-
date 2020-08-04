import { SelfRoute } from './entity';
import { Injectable, Component } from '@angular/core';
import { RouterService as dyRouter } from "./../module/dou-yin/router.service";
import { RegComponent } from 'src/app/components/reg/reg.component';
import { ChangePasswordComponent } from 'src/app/components/change-password/change-password.component';
import { UserInfoComponent } from 'src/app/components/user-info/user-info.component';
import { AuthGuardService } from './guard/auth-guard.service';
import { Config } from 'src/app/Config';
import { LoginComponent } from './../login/login.component';
import { AppFrameComponent } from 'src/app/components/app-frame/app-frame.component';
import { MainComponent } from 'src/app/components/main.component';


@Injectable({
  providedIn: 'root'
})
export class RouterService {
  constructor(private dyRouter: dyRouter) { }
  get rootroute() {
    return [
      { path: 'login', component: LoginComponent },
      { path: 'change-password', component: ChangePasswordComponent },
      { path: 'reg', component: RegComponent },
      {
        path: '', component: AppFrameComponent, children:
          [
            {
              path: 'dy', component: MainComponent, children: [
                {
                  path: '',
                  children: this.dyRouter.routerCogfig
                }
              ], canActivate: [AuthGuardService]
            },
            {
              path: 'user-info',
              component: UserInfoComponent
            },
            {
              path: 'device',
              loadChildren: () => import('src/app/module/components/device/device.module').then(m => m.DeviceModule)
            },
            {
              path: 'my-task',
              loadChildren: () => import('src/app/module/components/my-task/my-task.module').then(m => m.MyTaskModule)
            },
            { path: '**', redirectTo: 'device', pathMatch: 'full' }
          ]
      },
      { path: '**', redirectTo: '', pathMatch: 'full' } // 路由重定向
    ]
  }
}
