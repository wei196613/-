import { Pipe, PipeTransform } from '@angular/core';
import { Config } from '../Config';

@Pipe({
  name: 'dyStatus'
})
export class DyStatusPipe implements PipeTransform {

  transform(value: number): string {
    const v = Config.taskStatus.find(({ key }) => key === value);
    return v ? v.value : '';
  }

}
