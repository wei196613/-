import { ClickStopDirective } from './directive/clickStop.directive';
import { TaskExecutePipe } from './pipe/JdLoginExecute.pipe';
import { TaskStatusPipe } from './pipe/JdLoginStatus.pipe';
import { AgentTypePipe } from './pipe/agentType.pipe';
import { SpinMaskComponent } from './spin-mask/spin-mask.component';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppFrameComponent } from './app-frame/app-frame.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { TitleComponent } from './title/title.component';
import { CopyComponent } from './copy/copy.component';
import { UserAccountComponent } from './user-account/user-account.component';
import { InputTpePipe } from './pipe/inputTpe.pipe';

@NgModule({
  declarations: [
    SpinMaskComponent,
    AppFrameComponent,
    ChangePasswordComponent,
    AgentTypePipe,
    TitleComponent,
    CopyComponent,
    TaskStatusPipe,
    TaskExecutePipe,
    ClickStopDirective,
    UserAccountComponent,
    InputTpePipe
  ],
  imports: [
    CommonModule,
    NgZorroAntdModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [
    NgZorroAntdModule,
    SpinMaskComponent,
    FormsModule,
    AppFrameComponent,
    AgentTypePipe,
    ReactiveFormsModule,
    TitleComponent,
    CopyComponent,
    TaskStatusPipe,
    TaskExecutePipe,
    ClickStopDirective,
    UserAccountComponent,
    InputTpePipe
  ]
})
export class ComponentsModule { }
