import { Component, OnInit, Input } from '@angular/core';
import { TaskDetail, TaskItem } from 'src/app/services/jd/task.service';

@Component({
  selector: 'app-task-detail',
  templateUrl: './task-detail.component.html',
  styleUrls: ['./task-detail.component.less']
})
export class TaskDetailComponent implements OnInit {
  @Input() taskDetail: TaskDetail;
  @Input() checkData: TaskItem;
  constructor() { }

  ngOnInit() {
  }
  /* 
  status: success 成功
        needAccountAuth 帐号需要验证
        oldAccount 老帐号
        passwordError 帐号密码错误
        freeze 脚本卡死
        allProductTried 所有商品都试过了，但找不到合适的 */
  getStartText(s: string) {
    switch (s) {
      case 'success':
        return '成功';
      case 'needAccountAuth':
        return '帐号需要验证';
      case 'oldAccount':
        return '老帐号';
      case 'passwordError':
        return '帐号密码错误';
      case 'freeze':
        return '脚本卡死';
      case 'allProductTried':
        return '所有商品都试过了，但找不到合适的';
      case 'processing':
        return '未完成';
      default: return '未完成'
    }
  }
}
