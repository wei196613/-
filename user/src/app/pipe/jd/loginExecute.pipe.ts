import { Pipe, PipeTransform } from '@angular/core';
import { Config } from 'src/app/Config';

@Pipe({
  name: 'loginExecute'
})

export class LoginExecutePipe implements PipeTransform {
  transform(value: number): string {
    const v = Config.loginExecute.find(({ key }) => key === value);
    return v ? v.value : '';
  }

}
