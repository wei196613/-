import { ScriptExcel } from 'src/app/services/dy/dy-play.service';
import { Component, OnInit, Input } from '@angular/core';
import { format } from 'date-fns';
import { ByValueService } from 'src/app/services/by-value.service';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.less']
})
export class AddComponent implements OnInit {
  @Input() data: ScriptExcel;
  name: string;
  onBeforeUpload = (file): boolean => {
    const that = this;
    if (file) {
      const fileName = file.name;
      const reader: FileReader = new FileReader();
      reader.onload = (e) => {
        const res = e.target['result'];
        that.byVal.sendMeg({ key: 'parse_script_excel', data: res });
      }
      reader.readAsDataURL(file);
    }
    return false; // 阻止自动上传
  }
  constructor(private byVal: ByValueService) { }

  ngOnInit() {
  }
  submitForm() {
    this.byVal.sendMeg({ key: 'add_start', data: { name: this.name, excelKey: this.data.key } })
  }
}
