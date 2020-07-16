import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GenTemXLSXService {

  constructor() { }
  exportExcel(arr: string[]) {
    import("xlsx").then(xlsx => {
      let workbook = { Sheets: {}, SheetNames: [] };
      const XLSXTitle = {}
      arr.forEach(v => {
        XLSXTitle[v] = '';
      });
      arr.forEach(v => {
        workbook.Sheets[v] = xlsx.utils.json_to_sheet([XLSXTitle]);
        workbook.SheetNames.push(v);
      })
      const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
      this.saveAsExcelFile(excelBuffer);
    });
  }

  saveAsExcelFile(buffer: any): void {
    import("file-saver").then(FileSaver => {
      let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
      let EXCEL_EXTENSION = '.xlsx';
      const data: Blob = new Blob([buffer], {
        type: EXCEL_TYPE
      });
      FileSaver.saveAs(data, '模板' + new Date().getTime() + EXCEL_EXTENSION);
    });
  }
}
