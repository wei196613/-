import { ByValueService } from 'src/app/services/by-value.service';
import { Component, OnInit, Input } from '@angular/core';
import { Comments, ScriptsItem } from 'src/app/services/dy/dy-play.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.less']
})
export class DetailsComponent implements OnInit {
  @Input() data: Comments;
  @Input() selectItem: ScriptsItem
  constructor(private byVal: ByValueService) { }

  ngOnInit() {
  }

  handlePageIndexChange(curPage: number) {
    this.byVal.sendMeg({ key: 'more_comments', data: { scriptId: this.selectItem.id, curPage } })
    // this.byVal.sendMeg({ key: 'more_comments', data: { scriptId: 12, curPage } })
  }
}
