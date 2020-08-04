import { Pipe, PipeTransform } from '@angular/core';
import { Config } from 'src/app/Config';

@Pipe({
  name: 'loginMethod'
})
export class loginMethodPipe implements PipeTransform {

  transform(value: number): string {
    const v = Config.loginMethod.find(({ key }) => key === value);
    return v ? v.value : '';
  }

}
