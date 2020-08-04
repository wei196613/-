import { Pipe, PipeTransform } from '@angular/core';
import { Config } from 'src/app/Config';

@Pipe({
  name: 'inputTpe'
})
export class InputTpePipe implements PipeTransform {

  transform(value: number): string {
    return Config.Actiontpe.find(v => v.key === value)?.value;
  }

}
