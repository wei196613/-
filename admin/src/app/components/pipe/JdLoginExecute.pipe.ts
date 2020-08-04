import { Pipe, PipeTransform } from '@angular/core';
import { Config } from 'src/app/Config';

@Pipe({
  name: 'TaskExecute'
})
export class TaskExecutePipe implements PipeTransform {

  transform(value: number): string {
    const v = Config.taskExecute.find(({ key }) => key === value);
    return v ? v.value : '';
  }

}
