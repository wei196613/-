import { Injectable } from '@angular/core';
import { LoginService } from 'src/app/services/login.service';
import { Router } from '@angular/router';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpErrorResponse,
  HttpHeaderResponse,
  HttpResponse,
} from '@angular/common/http';
import { of, Observable } from "rxjs";
import { catchError, mergeMap } from 'rxjs/operators';
import { PlatformLocation } from '@angular/common';
import { NzMessageService } from 'ng-zorro-antd';

@Injectable()
export class MyInterceptor implements HttpInterceptor {
  constructor(private router: Router, private login: LoginService, private location: PlatformLocation, private hintMsg: NzMessageService) { }
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpHeaderResponse | HttpResponse<any>> {
    let req = request.clone();//这里可以在请求中加参数
    return next.handle(req).pipe(mergeMap((event: any) => {
      console.log(event);
      // 正常返回，处理具体返回参数
      if (event instanceof HttpResponse && event.status === 200)
        /* 具体处理请求返回数据 */
        return this.handleData(event);
      return of(event);
    }), catchError((err: HttpErrorResponse) => this.handleData(err)))
  }
  private handleData(
    event: HttpResponse<any> | HttpErrorResponse,
  ): Observable<any> {
    // 业务处理
    switch (event.status) {
      case 0:
        throw new Error('服务器连接失败');
        break
      case 401:
        throw new Error((event as HttpErrorResponse)?.error?.msg);
        break;
      case 403:
        const msgArr = (event as HttpErrorResponse)?.error?.msg.split('\n') as string[];
        if (msgArr.length <= 1) {
          throw new Error((event as HttpErrorResponse)?.error?.msg);
        }
        let msg = '';
        msgArr.forEach((v, index) => msg += (index > 0 ? `<div class="text-align-left">${v}</div>` : v))
        throw new Error(msg);
        break;
      case 408:
        this.login.routerUrl = location.pathname;
        this.router.navigate(['/login']);
        throw new Error('登录超时，请登录后再试');
        break;
      case 449:
        throw new Error('449');
        break;
      default:
        return of(event);
        break;
    }
  }
}