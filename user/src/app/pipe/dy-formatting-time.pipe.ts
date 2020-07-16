import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dyFormattingTime'
})

/*****
 * 将毫秒数格式化成 00:00:00.000 式字符串 管道
 * 
*/
export class DyFormattingTimePipe implements PipeTransform {

  transform(value: any): string {
    if (value) {
      // let newVal = Math.abs(value);
      let newVal = value;
      const h = Math.floor(newVal / 1000 / 60 / 60);
      newVal = h ? newVal % (h * 1000 * 60 * 60) : newVal;
      const m = Math.floor(newVal / 1000 / 60);
      newVal = m ? newVal % (m * 1000 * 60) : newVal;
      const s = Math.floor(newVal / 1000);
      newVal = s ? newVal % (s * 1000) : newVal;
      let arr: (number | string)[] = [h, m, s]
      arr = arr.map(v => {
        if (v < 10) {
          return `0${v}`;
        }
        return v
      })
      if (newVal < 10) {
        newVal = `00${newVal}`
      } else if (newVal < 100) {
        newVal = `0${newVal}`
      }
      return arr.join(':') + '.' + newVal;
    }
    return '00:00:00.000';
  }

}
