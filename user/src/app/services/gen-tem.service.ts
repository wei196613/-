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
        XLSXTitle[v] = null;
      });
      arr.forEach(v => {
        workbook.Sheets[v] = xlsx.utils.json_to_sheet([XLSXTitle]);
        workbook.SheetNames.push(v);
      })
      console.log(workbook);
      const excelBuffer: any = xlsx.writeFile(workbook, '模板' + new Date().getTime() + '.xlsx', { sheet: '编辑' });
      // const excelBuffer: any = xlsx.writeFile(workbook, { bookType: 'xlsx', type: 'array' });
      // this.saveAsExcelFile(excelBuffer);
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
