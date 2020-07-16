import { async } from '@angular/core/testing';
import { Subscription } from 'rxjs';
import { AddAction, InputParas, OutputParas, ActionTagsItem, Actions, ActionTypeNames, GetActionById, Tags, Paras, EditTaskType, OutputRefs, ParaAlias } from 'src/app/services/entity';
import { NzMessageService } from 'ng-zorro-antd';
import { AbstractControl } from '@angular/forms';
import { Validators, FormGroup, FormArray } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { Component, OnInit, Input } from '@angular/core';
import { ByValueService } from 'src/app/services/by-value.service';
import { Config } from 'src/app/Config';
import { TagService } from 'src/app/services/tag.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.less', '../add/add.component.less']
})
export class EditComponent implements OnInit {
  @Input() data: EditTaskType;
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
  /**action 数组*/
  actionData: ActionTagsItem[] = [];
  sub: Subscription;
  constructor(private fb: FormBuilder, private byVal: ByValueService, private hintMsg: NzMessageService, private tag: TagService) { }
  ngOnInit() {
    this.tag.tagData = [];
    this.tagCheck = this.tag.tagData;
    this.formGroup = this.fb.group({
      name: [null, [Validators.required]],
      id: [null, [Validators.required]]
    });
    this.sub = this.byVal.getMeg().subscribe(res => {
      switch (res.key) {
        case 'get_action_config_success':
          this.actionDataPush(res.data);
          break;
        case 'get_action_config_all_success':
          this.circulActionAll(res.data);
          break;
        case 'edit_tag_success':
          this.handleEditTagSuccess(res.data);
          break;
        default:
          break;
      }
    })
    this.patchValue();
  }
  /**循环生成actiondata 和 填充tagService 的 tagData*/
  private circulActionAll(data: GetActionById[]) {
    const { actionRels, paras } = this.data;
    actionRels.sort((a, b) => a.order - b.order);
    this.circulActionRels(actionRels, data, paras);
    this.circulParas(paras);
  }
  /**循环填充tagService 的 tagData*/
  private circulParas(paras: Paras[]) {
    paras.forEach(v => {
      const { defaultValue, name, key, actionConfId } = v;
      let tag: Tags = null;
      this.actionData.some(i => i.inputTags.find(n => {
        if (n.id === actionConfId) {
          tag = n;
          return true;
        }
      }));
      if (name !== tag.oldName && key !== tag.oldKey) {
        tag.newName = null;
        tag.newKey = null;
      }
      tag.defaultValue = defaultValue;
      this.tag.pushTag(tag);
    })
  }
  /**循环出actionData*/
  private circulActionRels(actionRels: Actions[], data: GetActionById[], paras: Paras[]) {
    actionRels.forEach(v => {
      let { id, outputRefs, paraAlias } = v;
      const actionItem = data.find(v => v.id === id);
      if (actionItem) {
        this.actionDataPush(actionItem);
        if (outputRefs) {
          outputRefs = JSON.parse(outputRefs as string) as OutputRefs[];
          outputRefs.forEach(i => {
            const inputIndex = this.actionData[v.order - 1].inputTags.findIndex(v => v.oldKey === i.inputKey);
            let inputTag = this.actionData[v.order - 1].inputTags[inputIndex];
            const outputIndex = this.actionData[i.refOrder - 1].outputTags.findIndex(n => n.oldKey === i.refOutputKey);
            console.log('outputIndex', outputIndex);
            inputTag.refOrder = `${i.refOrder - 1},${outputIndex}`;
            const outTag = this.actionData[i.refOrder - 1].outputTags[outputIndex];
            if (!outTag.bindTag) {
              outTag.bindTag = [[v.order - 1, inputIndex]]
            } else {
              if (!outTag.bindTag.some(s => s[0] === (v.order - 1) && s[1] === inputIndex)) {
                outTag.bindTag.push([v.order - 1, inputIndex])
              }
            }
            inputTag = this.tag.pushTag(inputTag);
          })
        }
        if (paraAlias) {
          paraAlias = JSON.parse(paraAlias as string) as ParaAlias[];
          paraAlias.forEach(i => {
            let inputTag = this.actionData[v.order - 1].inputTags.find(v => v.oldKey === i.key);
            inputTag.newKey = i.alias;
            inputTag.newName = paras.find(n => n.actionConfId === inputTag.id).name;
            inputTag = this.tag.pushTag(inputTag);
          })
        }
      }
    });
  }
  /**接受到action详情提取有用信息*/
  actionDataPush(data: GetActionById) {
    const { inputParas, outputParas, id, name } = data;
    const tagData = this.tag.tagData;
    this.actionData.push({ id, name, inputTags: [], outputTags: [] })
    const actionLength = this.actionData.length - 1;
    this.tagPush(actionLength, inputParas, 'inputTags');
    this.tagPush(actionLength, outputParas, 'outputTags');
    this.onCancel();
  }
  /**添加tag*/
  private tagPush(actionLength: number, paras: InputParas[] | OutputParas[], type: 'inputTags' | 'outputTags') {
    paras.forEach((v, index) => {
      if (type === 'outputTags') {
        this.actionData[actionLength][type].push({ oldName: v.name, oldKey: v.key, id: v.id, type, refOrder: `${actionLength},${index}` })
      } else {
        this.actionData[actionLength][type].push({
          oldName: v.name,
          oldKey: v.key,
          id: v.id,
          type
        })
      }
    })
  }
  /**提交*/
  submitForm() {
    if (this.formGroup.valid) {
      this.editStart();
    } else {
      for (const i in this.formGroup.controls) {
        this.formGroup.controls[i].markAsDirty();
        this.formGroup.controls[i].updateValueAndValidity();
      }
    }
  }
  /**开始添加*/
  private editStart() {
    const data = { ...this.formGroup.value, actionRels: [], paras: [] };
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
    this.byVal.sendMeg({ key: 'edit_start', data });
  }

  /**修改参数完成*/
  handleEditTagSuccess(data: Tags) {
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
              this.editTagBind.push({ value: `${index},${n}`, name: `action${index + 1}第${n + 1}输出参数` })
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
    this.actionData.splice(index, 1);
    this.tagCheck = this.tag.tagData;
  }

  /**填充*/
  patchValue() {
    this.byVal.sendMeg({ key: 'get_action_config_all', data: [...new Set(this.data.actionRels.map(i => i.id))] })
    this.formGroup.patchValue({
      id: this.data.id,
      name: this.data.name
    })
  }
  /**打开对话框*/
  handleOpenModal(key: string) {
    this.modalKey = key;
    this.visible = true;
  }
  /**关闭 | 关闭 弹框*/
  onCancel() {
    [this.tagEditIndex.action, this.tagEditIndex.tag] = [null, null];
    this.editTagBind = [];
    this.visible = false;
    const timer = setTimeout(() => {
      this.modalKey = ''
      clearTimeout(timer);
    }, 100);
  }
  ngOnDestroy(): void {
    this.sub && this.sub.unsubscribe()
  }
  /**填充JSON*/
  patchValueJSON() {

  }
  /**检查内容是否改动*/
  query() { }
}
