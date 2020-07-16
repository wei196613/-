import { Pipe, PipeTransform } from '@angular/core';
import { Config } from 'src/app/Config';

@Pipe({
  name: 'JdLoginStatus'
})
export class JdLoginStatusPipe implements PipeTransform {

  transform(value: number, execute?: number): string {
    const v = Config.jdLoginStatus.find(({ key }) => key === value);
    // if (value === 1) return v ? v.value.split(',')[execute - 1] : '';
    return v ? v.value : '';
  }
}
