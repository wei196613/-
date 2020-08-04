import { Config } from 'src/app/Config';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'loginType'
})
export class LoginTypePipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (value) {
      return Config.loginType.find(({ key }) => key === value).value
    }
    return '';
  }

}
