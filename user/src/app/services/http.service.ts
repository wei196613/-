import { format } from 'date-fns';
import { NzMessageService } from 'ng-zorro-antd';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError, Subscriber } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CommonResp } from './entity';
import { Config } from 'codelyzer';
import { Config as c1 } from '../Config';

/***
 *@User chauncey
 *@Date 2019/9/16
 **/

const httpOptions = {
  withCredentials: true
};

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private http: HttpClient, private hintMsg: NzMessageService) {
  }

  private _get<T>(prefixUrl: string, path: string): Observable<T> {
    return new Observable(obs => {
      const sub = this.http.get(`${prefixUrl}/${path}`, httpOptions).subscribe(
        (resp: T) => obs.next(resp),
        error => this._errorHandler(error, obs),
        () => obs.complete()
      );
      return () => {
        sub.unsubscribe();
      };
    });
  }

  private _post<T>(prefixUrl: string, path: string, params?: any): Observable<T> {
    return new Observable(obs => {
      const sub = this.http.post(`${prefixUrl}/${path}`, params, httpOptions).subscribe(
        (resp: T) => obs.next(resp),
        error => this._errorHandler(error, obs),
        () => obs.complete()
      );
      return () => {
        sub.unsubscribe();
      };
    });
  }

  private _errorHandler(error: any, obs: Subscriber<any>) {
    if (error.status === 0) {
      this.hintMsg.error("服务器连接失败")
    } else if (error.status >= 400) {
      this.hintMsg.error(error.error.msg)
    }
    return obs.error(error)
  }

  public get<T>(path: string): Promise<T> {
    return this._get<T>(c1.prefixUrl(), path).toPromise();
  }

  public post<T>(path: string, params?: any): Promise<T> {
    return this._post<T>(c1.prefixUrl(), path, params).toPromise();
  }

  public dy_get<T>(path: string): Promise<T> {
    return this._get<T>(c1.dyUrl(), path).toPromise();
  }

  public dy_post<T>(path: string, params?: any): Promise<T> {
    return this._post<T>(c1.dyUrl(), path, params).toPromise();
  }

  public getUrl(url: string, params) {
    for (const key in params) {
      if (params[key] !== null && params[key] !== undefined && params[key] !== '') {
        if (Object.prototype.toString.call(params[key]) === '[object Date]') {
          url += `${key}=${format(params[key], 'yyyy-MM-dd HH:mm:ss')}&`
        } else {
          url += `${key}=${params[key]}&`
        }
      }
    }
    return url.slice(0, -1);
  }
}
