import { SelfRoute } from 'src/app/services/entity';
import { Injectable } from '@angular/core';
import { UserInfoService } from 'src/app/services/userInfo.service';
import { UserInfoComponent } from 'src/app/components/user-info/user-info.component';
import { Routes } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class RouterService {

  private routesAll: SelfRoute[] = [
    { path: 'account', name: '抖音账号管理', loadChildren: () => import('src/app/module/dou-yin/account/account.module').then(m => m.AccountModule) },
    { path: 'login', name: '抖音登录任务', loadChildren: () => import('src/app/module/dou-yin/login/login.module').then(m => m.LoginModule) },
    { path: 'play', name: "抖音剧本管理", loadChildren: () => import('src/app/module/dou-yin/play/play.module').then(m => m.PlayModule) },
    { path: 'run-task', name: "抖音直播任务", loadChildren: () => import('src/app/module/dou-yin/run-task/run-task.module').then(m => m.RunTaskModule) },
    { path: 'his-task', name: '抖音历史任务', loadChildren: () => import('src/app/module/dou-yin/his-task/his-task.module').then(m => m.HisTaskModule) }
  ]

  constructor(private user: UserInfoService) { }

  get routerCogfig(): Routes {
    const authRouter = this.routesAll.filter(({ name }) => this.user.authority.some(({ key, value }) => {
      if (name === '抖音历史任务') {
        return key === 2 || key === 4;
      }
      return value === name
    }))
    // authRouter.length === 0 && authRouter.push({ path: 'not-authority', component: NotAuthorityComponent });
    if (authRouter.length === 0) return [];
    authRouter.push({ path: '**', redirectTo: authRouter[0].path, pathMatch: 'full' });
    return authRouter
  }
}
