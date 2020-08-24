import { Injectable } from '@angular/core';
import { Subject, Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ByValueService {

  constructor() { }
  private subject$ = new Subject<any>();
  // 发送消息
  sendMeg(info: {
    key: string; data?: any
  }) {
    this.subject$.next(info);
  }
  // 清除消息
  clearMeg() {
    this.subject$.next();
  }
  // 接受消息
  getMeg(): Observable<{
    key: string; data?: any
  }> {
    return this.subject$.asObservable();
  }
}
