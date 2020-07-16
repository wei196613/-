import { Pipe, PipeTransform } from '@angular/core';
import { Config } from 'src/app/Config';

@Pipe({
  name: 'JdLoginExecute'
})
export class JdLoginExecutePipe implements PipeTransform {

  transform(value: number): string {
    const v = Config.jdLoginExecute.find(({ key }) => key === value);
    return v ? v.value : '';
  }

}
