import { Component, OnInit, Input } from '@angular/core';
import * as clipboard from "clipboard-polyfill";
import { NzMessageService } from 'ng-zorro-antd';

@Component({
  selector: 'app-copy',
  templateUrl: './copy.component.html',
  styleUrls: ['./copy.component.less']
})
export class CopyComponent implements OnInit {
  /**要拷贝的内容*/
  @Input() tipText: string;
  constructor(private msg: NzMessageService) { }

  ngOnInit() {
  }
  /**
   * copy 复制
   */
  public async copy() {
    await clipboard.writeText(this.tipText)
    this.msg.info('已复制到粘贴板');
  }
}
