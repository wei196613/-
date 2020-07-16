import { Pipe, PipeTransform } from '@angular/core';
import { Config } from '../Config';

@Pipe({
  name: 'taskEndStatus'
})
export class TaskEndStatusPipe implements PipeTransform {

  transform(value: number): string {
    const v = Config.taskEndStatus.find(({ key }) => key === value);
    return v ? v.value : '';
  }

}
