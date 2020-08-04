import { NzMessageService } from 'ng-zorro-antd';
import { Tags, InputParas, OutputParas } from './entity';
import { Injectable } from '@angular/core';
import { async } from '@angular/core/testing';

@Injectable({
  providedIn: 'root'
})
export class TagService {
  tagData: Tags[] = [];
  color: string[] = []
  constructor(private hintMsg: NzMessageService) {
    for (let i = 0; i < 100; i++) {
      this.color.push(this.randomColor())
    }
  }
  /**随机取色*/
  private randomColor() {
    // var colorValue = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 'a', 'b', 'c', 'd', 'e', 'f'];
    const colorValue = [8, 9, 'a', 'b', 'c', 'd', 'e', 'f'];
    let s = "#";
    for (var i = 0; i < 6; i++) {
      s += colorValue[Math.floor(Math.random() * 8)];
    }
    return s;
  }
  /**
   * 添加按钮
   */
  public pushTag(tag: Tags) {
    tag.color = this.color[this.tagData.length];
    tag.queue = (this.tagData.length + 1);
    this.tagData.push(tag);
    return tag;
  }

  /**查询数据*/
  public findTagData(tag: Tags): Tags {
    const { newKey, newName, defaultValue, refOrder, oldName, oldKey, tpe, type } = tag;
    let v: Tags = null;
    if (type === 'outputTags') {
      return this.tagData.find(i => i.refOrder === tag.refOrder)
    }
    if (refOrder) {
      v = this.tagData.find(i => i.refOrder === tag.refOrder && i.oldKey === oldKey && i.tpe === tpe);
    } else if (newKey && newName) {
      v = this.tagData.find(i => i.newKey === newKey && i.tpe === tpe && !i.refOrder);
    } else if (defaultValue) {
      v = this.tagData.find(i => i.defaultValue === defaultValue && i.oldKey === oldKey && i.tpe === tpe && !i.refOrder);
    } else {
      v = this.tagData.find(i => !(i.newKey) && i.oldKey === oldKey && i.tpe === tpe && !i.refOrder);
    }
    return v;
  }
  /**查询*/
  public findTagIndex(tag: Tags) {
    const { newKey, newName, defaultValue, refOrder, oldName, oldKey, tpe } = tag;
    let v: number = null;
    if (newKey && newName) {
      v = this.tagData.findIndex(i => i.newKey === newKey && i.tpe === tpe && !i.refOrder);
    } else if (defaultValue) {
      v = this.tagData.findIndex(i => i.defaultValue === defaultValue && i.oldKey === oldKey && i.tpe === tpe && !i.refOrder);
    } else if (refOrder) {
      v = this.tagData.findIndex(i => i.refOrder === tag.refOrder && i.oldKey === oldKey && i.tpe === tpe);
    } else {
      v = this.tagData.findIndex(i => !(i.newKey) && i.oldKey === oldKey && i.tpe === tpe && !i.refOrder);
    }
    return v;
  }
  /**移除*/
  public removeTag(tag: Tags) {
    const v = this.findTagIndex(tag);
    if (v != -1) {
      this.tagData.forEach((item, i) => {
        if (i > v) {
          item.queue -= 1;
        }
      })
      this.tagData.splice(v, 1);
    }
  }

}
