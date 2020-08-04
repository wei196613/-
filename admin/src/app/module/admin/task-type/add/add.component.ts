import { async } from '@angular/core/testing';
import { Subscription } from 'rxjs';
import { AddAction, InputParas, OutputParas, ActionTagsItem, Actions, ActionTypeNames, GetActionById, Tags, Paras } from 'src/app/services/entity';
import { NzMessageService } from 'ng-zorro-antd';
import { AbstractControl } from '@angular/forms';
import { Validators, FormGroup, FormArray } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { Component, OnInit, Input } from '@angular/core';
import { ByValueService } from 'src/app/services/by-value.service';
import { Config } from 'src/app/Config';
import { type } from 'os';
import { TagService } from 'src/app/services/tag.service';


@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.less']
})
export class AddComponent implements OnInit {
  /**保存数据库拉取的action*/
  @Input() actionTable: ActionTypeNames;
  /**已经点亮的action参数列表*/
  tagCheck: Tags[];
  /**tag点亮的顺序*/
  tagQueue = 0;
  /**导入的json*/
  inputJson: string;
  /**修改tag参数*/
  tagEditData: Tags;
  /**修改参数可绑定的参数数组*/
  editTagBind: { value: string, name: string }[] = [];
  /**修改tag对象的位置*/
  tagEditIndex = { action: null, tag: null };
  /**控制弹框是否打开*/
  visible = false;
  /**控制弹框内容*/
  modalKey = '';
  /**表单控件*/
  formGroup: FormGroup;
  /**记录点击添加的位置*/
  addActionIndex = null;
  /**action 数组*/
  actionData: ActionTagsItem[] = [];
  sub: Subscription;
  constructor(private fb: FormBuilder, private byVal: ByValueService, private hintMsg: NzMessageService, private tag: TagService) { }
  ngOnInit() {
    this.tag.tagData = [];
    this.tagCheck = this.tag.tagData;
    this.formGroup = this.fb.group({
      name: [null, [Validators.required]]
    });
    this.sub = this.byVal.getMeg().subscribe(res => {
      switch (res.key) {
        case 'get_action_config_success':
          this.actionDataPush(res.data, this.addActionIndex);
          break;
        case 'edit_tag_success':
          this.handleEditTagSuccess(res.data);
          break;
        default:
          break;
      }
    })
  }

  /**接受到action详情提取有用信息*/
  actionDataPush(data: GetActionById, index: number) {
    const { inputParas, outputParas, id, name } = data;
    const tagData = this.tag.tagData;
    this.actionData.splice(index, 0, { id, name, inputTags: [], outputTags: [] });
    this.tagPush(index, inputParas, 'inputTags');
    this.tagPush(index, outputParas, 'outputTags');
    this.bindDispose('add', this.addActionIndex);
    console.log(this.actionData);
    this.onCancel();
  }
  /**中间插入或删除进行数据绑定关系进行处理*/
  private bindDispose(key: 'delect' | 'add', index: number) {
    this.actionData.forEach((v, actionIndex) => {
      if (actionIndex >= index) {
        v.outputTags.forEach((i, tagIndex) => {
          i.refOrder = `${actionIndex},${tagIndex}`;
          i.bindTag && this.inputTagDispose(i, key, index);
        })
      }
    })
  }
  /**绑定的tag关系进行处理*/
  private inputTagDispose(tag: Tags, key: 'delect' | 'add', index: number) {
    tag.bindTag.forEach(v => {
      if (v[0] >= index) {
        const inputTag = this.actionData[v[0]].inputTags[v[1]];
        v[0] = key === 'delect' ? v[0] - 1 : v[0] + 1;
        this.tag.findTagData(inputTag).refOrder = tag.refOrder;
        inputTag.refOrder = tag.refOrder;
      }
    })
  }
  /**添加tag*/
  private tagPush(actionLength: number, paras: InputParas[] | OutputParas[], type: 'inputTags' | 'outputTags') {
    paras.forEach((v, index) => {
      if (type === 'outputTags') {
        this.actionData[actionLength][type].push({ oldName: v.name, oldKey: v.key, id: v.id, type, refOrder: `${actionLength},${index}` });
      } else {
        this.actionData[actionLength][type].push({ oldName: v.name, oldKey: v.key, id: v.id, type });
      }
    })
  }
  /**提交*/
  submitForm() {
    if (this.formGroup.valid) {
      this.addStart();
    } else {
      for (const i in this.formGroup.controls) {
        this.formGroup.controls[i].markAsDirty();
        this.formGroup.controls[i].updateValueAndValidity();
      }
    }
  }
  /**开始添加*/
  private addStart() {
    const data = { name: this.formGroup.get('name').value, actionRels: [], paras: [] };
    this.actionData.forEach((v, actionIndex) => {
      const outputRefs = [];
      const paraAlias = [];
      v.inputTags.forEach(i => {
        const { newName, newKey, refOrder } = i;
        if (refOrder) {
          const ref = refOrder.split(',').map(Number);
          outputRefs.push({ refOrder: ref[0] + 1, refOutputKey: this.actionData[ref[0]].outputTags[ref[1]].oldKey, inputKey: i.oldKey });
        } else if (newName && newKey) {
          paraAlias.push({ key: i.oldKey, alias: newKey })
        }
      })
      const actionsItem: Actions = { id: v.id, order: actionIndex + 1 }
      if (outputRefs.length > 0) {
        actionsItem.outputRefs = JSON.stringify(outputRefs);
      }
      if (paraAlias.length > 0) {
        actionsItem.paraAlias = JSON.stringify(paraAlias);
      }
      data.actionRels.push(actionsItem);
    })
    this.tag.tagData.forEach(v => {
      const paras: Paras = { actionConfId: v.id };
      if (v.newKey && v.newName) {
        paras.key = v.newKey;
        paras.name = v.newName;
      } else if (v.defaultValue) {
        console.log(v.defaultValue);
        paras.defaultValue = v.defaultValue;
      }
      if (!v.refOrder) {
        data.paras.push(paras)
      }
    })
    this.byVal.sendMeg({ key: 'add_start', data });
  }

  /**修改参数完成*/
  handleEditTagSuccess(data: Tags) {
    console.log(data);
    const tag = this.tag.pushTag(data);
    this.actionData[this.tagEditIndex.action].inputTags[this.tagEditIndex.tag] = tag;
    if (data.refOrder) {
      const indexArr = data.refOrder.split(',').map(Number);
      const outTag = this.actionData[indexArr[0]].outputTags[indexArr[1]];
      outTag.queue = tag.queue;
      outTag.color = tag.color;
      if (outTag.bindTag) {
        if (!outTag.bindTag.some(v => v[0] === this.tagEditIndex.action && v[1] === this.tagEditIndex.tag)) outTag.bindTag.push([this.tagEditIndex.action, this.tagEditIndex.tag])
      } else {
        outTag.bindTag = [[this.tagEditIndex.action, this.tagEditIndex.tag]]
      }
    }
    this.onCancel();
  }


  /**重命名tag或更换绑定*/
  handleEditTag(tagIndex: number, actionIndex: number) {
    this.tagEditData = this.actionData[actionIndex].inputTags[tagIndex];
    this.tagEditIndex.action = actionIndex;
    this.tagEditIndex.tag = tagIndex;
    const { oldKey, tpe, newKey } = this.tagEditData;
    this.actionData.forEach((v, index) => {
      if (index < actionIndex) {
        v.outputTags.forEach((i, n) => {
          if (newKey) {
            if (i.oldKey === newKey && tpe === i.tpe) {
              this.editTagBind.push({ value: i.refOrder, name: `action${index + 1}第${n + 1}输出参数` })
            }
          } else {
            if (i.oldKey === oldKey && tpe === i.tpe) {
              this.editTagBind.push({ value: `${index},${n}`, name: `action${index + 1}第${n + 1}输出参数` })
            }
          }
        })
      }
    })
    this.handleOpenModal('open_edit');
  }

  /**删除*/
  handleDelAction(index: number) {
    const action = this.actionData[index];
    action.inputTags.forEach(v => {
      if (v.refOrder) {
        this.tag.removeTag(v);
      } else if (v.newName && v.newKey) {
        this.tag.removeTag(v);
      } else if (v.defaultValue) {
        this.tag.removeTag(v);
      } else if (v.actionIndex && v.actionIndex.length === 1) {
        this.tag.removeTag(v)
      }
    })
    action.outputTags.forEach(v => {
      if (v.bindTag) {
        const tag = this.tag.findTagData(v);
        if (tag) this.tag.removeTag(tag);
        v.bindTag.forEach(i => this.actionData[i[0]].inputTags[i[1]].refOrder = null)
      }
    })
    this.bindDispose('delect', index);
    this.actionData.splice(index, 1);
    this.tagCheck = this.tag.tagData;
  }
  /**填充*/
  patchValue() {

  }
  /**打开对话框*/
  handleOpenModal(key: string, index = 0) {
    this.addActionIndex = index;
    this.modalKey = key;
    this.visible = true;
  }
  /**关闭 | 关闭 弹框*/
  onCancel() {
    [this.tagEditIndex.action, this.tagEditIndex.tag] = [null, null];
    this.addActionIndex = null;
    this.editTagBind = [];
    this.visible = !this.visible;
    const timer = setTimeout(() => {
      this.modalKey = ''
      clearTimeout(timer);
    }, 100);
  }
  ngOnDestroy(): void {
    this.sub && this.sub.unsubscribe()
  }
}
