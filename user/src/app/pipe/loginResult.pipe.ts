import { Config } from 'src/app/Config';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'loginResult'
})
export class LoginResultPipe implements PipeTransform {

  transform(value: number): any {
    const v = Config.loginResult.find(({ key }) => key === value);
    return v ? v.value : '';
  }

}
