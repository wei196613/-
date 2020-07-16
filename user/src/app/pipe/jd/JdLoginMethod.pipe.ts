import { Pipe, PipeTransform } from '@angular/core';
import { Config } from 'src/app/Config';

@Pipe({
  name: 'JdLoginMethod'
})
export class JdLoginMethodPipe implements PipeTransform {

  transform(value: number): string {
    const v = Config.jdLoginMethod.find(({ key }) => key === value);
    return v ? v.value : '';
  }

}
