import { CommonResp } from 'src/app/services/entity';
import { HttpService } from './http.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SafetyService {

  constructor(private http: HttpService) { }

  /**
   * getSafetyAuthInfo
   * POST /getSafetyAuthInfo
   * 开启安全认证
   */
  public getSafetyAuthInfo(params: { password: string }) {
    return this.http.post<{ qr: string, username: string, sk: string }>('getSafetyAuthInfo', params);
  }

  /**
   * turnOffSafetyCertification
   * POST /turnOffSafetyCertification
   * 关闭安全认证
   */
  public turnOffSafetyCertification(params: { password: string, totp: number }) {
    return this.http.post<CommonResp>('turnOffSafetyCertification', params);
  }

  /**
   * turnOnSafetyCertification
   * POST /turnOnSafetyCertification
   * 验证安全认证的验证码
   */
  public turnOnSafetyCertification(params: { password: string, sk: string, totp: number }) {
    return this.http.post<CommonResp>('turnOnSafetyCertification', params);
  }

  /**
   * turnOnLoginProtect
   * POST /turnOnLoginProtect
   * 开启登录安全认证  // 开启安全认证的前提下才能开启登录安全认证
   */
  public turnOnLoginProtect() {
    return this.http.post<CommonResp>('turnOnLoginProtect');
  }

  /**
   * turnOffLoginProtect
   * POST /turnOffLoginProtect
   * 关闭登录安全认证
   */
  public turnOffLoginProtect(params: { password: string, totp: number }) {
    return this.http.post<CommonResp>('turnOffLoginProtect', params);
  }
}
