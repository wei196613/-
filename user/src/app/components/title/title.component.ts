import { ByValueService } from './../../services/by-value.service';
import { Component, OnInit, Input, TemplateRef, ViewChild, ViewContainerRef, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-title',
  templateUrl: './title.component.html',
  styleUrls: ['./title.component.less']
})
export class TitleComponent implements OnInit {
  @Input() titleTemRef: TemplateRef<void>; // 自定义其他得 html模板
  @ViewChild('titleTem', { read: ViewContainerRef, static: true }) titleTem: ViewContainerRef; // 插入自定义html模板的模板
  @Output() titleQuery = new EventEmitter<string>(); // 发出查询
  @Output() titleReset = new EventEmitter<void>(); // 发出清除
  msg: string;
  constructor(private byVal: ByValueService) { }

  ngOnInit() {
    if (this.titleTemRef) {
      this.titleTem.createEmbeddedView(this.titleTemRef);
    }
  }

  query() {
    this.titleQuery.emit(this.msg);
  }
  reset() {
    this.msg = null;
    this.titleReset.emit();
  }
}
