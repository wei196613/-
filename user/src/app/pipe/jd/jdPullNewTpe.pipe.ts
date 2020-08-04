import { Pipe, PipeTransform } from '@angular/core';
import { Config } from 'src/app/Config';

@Pipe({
  name: 'jdPullNewTpe'
})
export class JdPullNewTpePipe implements PipeTransform {

  transform(value: number): string {
    const v = Config.pullNewTpe.find(({ key }) => key === value);
    return v ? v.value : '';
  }

}
