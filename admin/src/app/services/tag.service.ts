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
    // var colorValue = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 'a', 'b', 'c', 'd', 'e', 'f'];
    const colorValue = [
      [8, 9, 'a', 'b', 'c', 'd'],
      [3, 'a', 'b', 'c', 'd'],
      ['a', 'b', 'c'],
      [8, 9, 'a', 'b', 'c', 'd', 'e', 'f'],
      [8, 9, 'a', 'b', 'c', 'd', 'e', 'f'],
      [8, 9, 'a', 'b', 'c', 'd', 'e', 'f']];
    let s = "#";
    for (var i = 0; i < 6; i++) {
      s += colorValue[i][Math.floor(Math.random() * colorValue[i].length)];
    }
    return s;
  }
  /**
   * 添加按钮
   */
  public pushTag(tag: Tags) {
    const data = this.findTagData(tag);
    if (data) {
      return data;
    }
    tag.color = this.color[this.tagData.length];
    tag.queue = (this.tagData.length + 1);
    this.tagData.push(tag);
    return tag;
  }

  /**查询数据*/
  public findTagData(tag: Tags): Tags {
    const { newKey, newName, refOrder, oldName, oldKey, tpe, type } = tag;
    let v: Tags = null;
    if (type === 'outputTags') {
      return this.tagData.find(i => i.refOrder === tag.refOrder)
    }
    if (refOrder) {
      v = this.tagData.find(i => i.refOrder === tag.refOrder && i.oldKey === oldKey && i.tpe === tpe);
    } else if (newKey && newName) {
      v = this.tagData.find(i => i.newKey === newKey && i.tpe === tpe && !i.refOrder);
    } else {
      v = this.tagData.find(i => !(i.newKey) && i.oldKey === oldKey && i.tpe === tpe && !i.refOrder);
    }
    return v;
  }
  /**查询*/
  public findTagIndex(tag: Tags) {
    const { newKey, newName, refOrder, oldName, oldKey, tpe, type } = tag;
    if (type === 'outputTags') return this.tagData.findIndex(i => i.refOrder === refOrder);
    let v: number = null;
    if (newKey && newName) {
      v = this.tagData.findIndex(i => i.newKey === newKey && i.tpe === tpe && !i.refOrder);
    } else if (refOrder) {
      v = this.tagData.findIndex(i => i.refOrder === refOrder && i.oldKey === oldKey && i.tpe === tpe);
    } else {
      v = this.tagData.findIndex(i => !(i.newKey) && i.oldKey === oldKey && i.tpe === tpe && !i.refOrder);
    }
    return v;
  }
  /**移除*/
  public removeTag(tag: Tags) {
    const v = this.findTagIndex(tag);
    console.log(v);
    if (v != -1) {
      this.tagData.forEach((item) => {
        if (item.queue > v) {
          item.queue -= 1;
        }
      })
      this.tagData.splice(v, 1);
    }
  }
}
