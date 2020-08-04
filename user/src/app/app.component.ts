import { RouterService } from './services/router.service';
import { ByValueService } from './services/by-value.service';
import { Router } from '@angular/router';
import { LoginService } from './services/login.service';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { AppSpinService } from './components/spin-mask/app-spin.service';
import { Config, ConfigData } from "./Config";
import { PlatformLocation } from '@angular/common'
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {
  locationUrl: string;
  sub: Subscription
  constructor(private http: HttpClient,
    private spin: AppSpinService,
    private router: Router,
    private login: LoginService,
    private location: PlatformLocation,
    private byVal: ByValueService,
    private routerService: RouterService) {
    login.routerUrl = location.pathname;
  }
  ngOnInit(): void {
    this.spin.open("配置加载中");
    this.sub = this.byVal.getMeg().subscribe(res => {
      if (res.key === 'get_user_info_success') {
        this.router.resetConfig(this.routerService.rootroute)
      }
    })
    this.http.get("assets/config.json").subscribe((resp: ConfigData) => {
      Config.data = resp;
      this.login.isLogin();
    });
  }
  ngOnDestroy(): void {
    this.sub && this.sub.unsubscribe();
  }
}
