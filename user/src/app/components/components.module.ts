import { SpinMaskComponent } from './spin-mask/spin-mask.component';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppFrameComponent } from './app-frame/app-frame.component';
import { TitleComponent } from './title/title.component';
import { PasswordInputComponent } from './password-input/password-input.component';
import { DyFormattingTimePipe } from 'src/app/pipe/dy-formatting-time.pipe';
// import { DeviceModule } from './device/device.module';
import { LoginTypePipe } from '../pipe/loginType.pipe';
import { PasswordTextComponent } from './password-text/password-text.component';
import { DyIconComponent } from './dyIcon.component';
import { JdIconComponent } from './jdIcon.component';
import { LoginResultPipe } from '../pipe/loginResult.pipe';
import { TaskEndStatusPipe } from '../pipe/taskEndStatus.pipe';
import { LoginStatusPipe } from 'src/app/pipe/jd/loginStatus.pipe';
import { loginMethodPipe } from 'src/app/pipe/jd/loginMethod.pipe';
import { LoginExecutePipe } from 'src/app/pipe/jd/loginExecute.pipe';
import { ClickStopDirective } from './clickStop.directive';

@NgModule({
   declarations: [
      SpinMaskComponent,
      AppFrameComponent,
      PasswordInputComponent,
      DyFormattingTimePipe,
      LoginTypePipe,
      PasswordTextComponent,
      TitleComponent,
      DyIconComponent,
      JdIconComponent,
      LoginResultPipe,
      TaskEndStatusPipe,
      LoginStatusPipe,
      loginMethodPipe,
      LoginExecutePipe,
      ClickStopDirective,
      
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
      ReactiveFormsModule,
      TitleComponent,
      PasswordInputComponent,
      DyFormattingTimePipe,
      LoginTypePipe,
      PasswordTextComponent,
      LoginResultPipe,
      TaskEndStatusPipe,
      LoginStatusPipe,
      loginMethodPipe,
      LoginExecutePipe,
      ClickStopDirective
   ]
})
export class ComponentsModule { }
