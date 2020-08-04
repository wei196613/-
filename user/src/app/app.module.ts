import { AppFrameComponent } from './components/app-frame/app-frame.component';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { RegComponent } from './components/reg/reg.component';
import { ComponentsModule } from 'src/app/components/components.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NZ_I18N, zh_CN } from 'ng-zorro-antd';
import zh from '@angular/common/locales/zh';
import { registerLocaleData } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { UserInfoComponent } from './components/user-info/user-info.component';
import { EmptyComponent } from './empty/empty.component';
import { MainComponent } from './components/main.component';

registerLocaleData(zh);
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    UserInfoComponent,
    RegComponent,
    ChangePasswordComponent,
    EmptyComponent,
    MainComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    ComponentsModule
  ],
  providers: [{ provide: NZ_I18N, useValue: zh_CN }],
  bootstrap: [AppComponent],
  entryComponents: [
    UserInfoComponent,
    RegComponent,
    ChangePasswordComponent,
    AppFrameComponent,
    MainComponent
  ]
})
export class AppModule { }
