import { Pipe, PipeTransform } from '@angular/core';
import { Config } from 'src/app/Config';

@Pipe({
  name: 'TaskStatus'
})
export class TaskStatusPipe implements PipeTransform {

  transform(value: number, execute?: number): string {
    const v = Config.taskStatus.find(({ key }) => key === value);
    return v ? v.value : '';
  }
}
