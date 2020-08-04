import { ByValueService } from 'src/app/services/by-value.service';
import { LoginService } from './services/login.service';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { AppSpinService } from './components/spin-mask/app-spin.service';
import { Config, ConfigData } from "./Config";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {
  constructor(private http: HttpClient, private spin: AppSpinService) { }
  ngOnInit(): void {
    this.spin.open("配置加载中");
    this.http.get("assets/config.json").subscribe((resp: ConfigData) => {
      Config.data = resp;
      this.spin.close();
    });
  }
}
 