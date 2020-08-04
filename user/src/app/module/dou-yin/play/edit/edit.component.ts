import { ScriptExcel, ScriptsItem, Comments, EditScriptParams } from 'src/app/services/dy/dy-play.service';
import { Component, OnInit, Input } from '@angular/core';
import * as XLSX from 'xlsx';
import { format } from 'date-fns';
import { ByValueService } from 'src/app/services/by-value.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.less']
})
export class EditComponent implements OnInit {
  @Input() data: ScriptsItem;
  @Input() excel: ScriptExcel;
  @Input() comments: Comments;
  uploadExcel: string | ArrayBuffer;
  get tableData() {
    return this.excel ? this.excel.arr : this.comments && this.comments.arr;
  }
  name: string;
  onBeforeUpload = (file): boolean => {
    if (file) {
      const that = this;
      const fileName = file.name;
      const reader: FileReader = new FileReader();
      reader.onload = (e) => {
        const res = e.target['result'];
        this.uploadExcel = res;
        that.byVal.sendMeg({ key: 'parse_script_excel', data: res });
      }
      reader.readAsDataURL(file);
    }
    return false; // 阻止自动上传
  }
  constructor(private byVal: ByValueService) { }

  ngOnInit() {
    this.name = this.data.name;
  }
  handleIndexChange(e) {
    this.byVal.sendMeg({ key: 'more_comments', data: e })
  }
  get roleNumber() {
    return this.excel ? this.excel.characterNumber : (this.data && this.data.characterNumber)
  }

  get commentNumber() {
    return this.excel ? this.excel.commentNumber : (this.data && this.data.commentNumber)
  }

  get roleTime() {
    return this.excel ? this.excel.totalTime : (this.data && this.data.totalTime);
  }

  submitForm() {
    if (!this.name || (this.name === this.data.name && !this.excel)) {
      return false;
    }
    const data: EditScriptParams = {
      id: this.data.id,
      name: this.name
    }
    if (this.uploadExcel) {
      data.excelKey = this.excel.key;
    }
    this.byVal.sendMeg({ key: 'edit_start', data })
  }
}
