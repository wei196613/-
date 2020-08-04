import { Component, OnInit, Input } from '@angular/core';
import { EditTaskType } from 'src/app/services/entity';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { ByValueService } from 'src/app/services/by-value.service';

@Component({
  selector: 'app-para-sort',
  templateUrl: './para-sort.component.html',
  styleUrls: ['./para-sort.component.less']
})
export class ParaSortComponent implements OnInit {
  @Input() data: EditTaskType;
  constructor(private byVal: ByValueService) { }

  ngOnInit(): void {
  }
  drop(event: CdkDragDrop<string[]>): void {
    moveItemInArray(this.data.paras, event.previousIndex, event.currentIndex);
  }
  submit() {
    const paras = this.data.paras.map(({ actionKey, actionConfKey, key }, order) => {
      let parasItem = { actionKey, actionConfKey, order: order + 1 };
      if (key !== actionConfKey) {
        parasItem['key'] = key;
      }
      return parasItem;
    });
    this.byVal.sendMeg({ key: 'sort_start', data: { taskTypeId: this.data.id, paras } });
  }
}
