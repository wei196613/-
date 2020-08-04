import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ActionTagsItem, Tags } from 'src/app/services/entity';
import { TagService } from 'src/app/services/tag.service';

@Component({
  selector: 'app-action',
  templateUrl: './action.component.html',
  styleUrls: ['./action.component.less']
})
export class ActionComponent implements OnInit {
  @Input() data: ActionTagsItem;
  @Output() dataDel = new EventEmitter<number>();
  @Output() editClick = new EventEmitter<number>();
  @Input() index: number;
  constructor(private tags: TagService) { }

  ngOnInit() {
  }
  handleDel() {
    this.dataDel.emit(this.index);
  }
  handleTagClick(item: Tags, type: 'inputTags' | 'outputTags', i: number) {
    if (type === 'outputTags') {
      const res = this.tags.findTagData(item);
      if (res) {
        this.tags.removeTag(item);
      }
    } else if (this.tags.findTagIndex(item) != -1) {
      const tag = this.data.inputTags[i]
      tag.refOrder = null;
      tag.newKey = null;
      tag.newName = null;
      tag.defaultValue = null;
      tag.queue = null;
      this.tags.removeTag(item);
    } else {
      this.data.inputTags[i] = this.tags.pushTag(item);
    }
  }
  handleEdit(e: Event, i: number) {
    e.stopPropagation();
    this.editClick.emit(i);
  }
  /**获取字体颜色*/
  color(tag: Tags) {
    const res = this.tags.findTagData(tag);
    if (res) {
      tag.queue = res.queue;
      tag.defaultValue = res.defaultValue;
      if (res.actionIndex) {
        if (!res.actionIndex.some(v => v === this.index)) res.actionIndex.push(this.index)
      } else {
        res.actionIndex = [this.index];
      }
      return { color: res.color, background: '#333' };
    }
    tag.queue = null;
    if (tag.type === 'inputTags') {
      tag.refOrder = null;
      tag.defaultValue = null;
    }
    return null;
  }

}
