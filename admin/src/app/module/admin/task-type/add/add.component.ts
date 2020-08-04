import { async } from '@angular/core/testing';
import { Subscription } from 'rxjs';
import { AddAction, InputParas, OutputParas, ActionTagsItem, EditTaskType, Actions, ActionTypeNames, GetActionByKey, Tags, Paras, OutputRefs, ParaAlias } from 'src/app/services/entity';
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
  @Input() data: EditTaskType;
  /**接受打开对话框的类型*/
  @Input() parentKey: 'open_add' | 'open_edit' | 'open_export';
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
        case 'get_action_config_all_success':
          this.circulActionAll(res.data);
          break;
        default:
          break;
      }
    })
    if (this.parentKey === 'open_edit') {
      this.patchValue();
    }
  }
  /**填充*/
  patchValue() {
    this.byVal.sendMeg({ key: 'get_action_config_all', data: [...new Set(this.data.actionRels.map(i => i.key))] })
    this.formGroup.patchValue({
      name: this.data.name
    })
  }
  /**填充json字符串*/
  patchJsonValue() {
    if (this.inputJson == null || this.inputJson == undefined || this.inputJson == '') {
      return this.hintMsg.error('请输入JSON后再试')
    }
    let key;
    const data = JSON.parse(this.inputJson) as EditTaskType;
    if (Object.prototype.toString.call(data) !== '[object Object]' || Object.prototype.toString.call(data.actionRels) !== '[object Array]') {
      return this.hintMsg.error('输入JSON格式不正确')
    }
    if (this.data && this.data.key) {
      key = this.data.key;
    }
    this.data = null;
    this.tag.tagData = [];
    this.actionData = [];
    this.data = data;
    this.data.key = key;
    this.patchValue();
  }
  /**循环生成actiondata 和 填充tagService 的 tagData*/
  private circulActionAll(data: GetActionByKey[]) {
    const { actionRels, paras } = this.data;
    actionRels.sort((a, b) => a.order - b.order);
    this.circulActionRels(actionRels, data, paras);
    this.circulParas(paras);
  }
  /**循环填充tagService 的 tagData*/
  private circulParas(paras: Paras[]) {
    paras.forEach(v => {
      const { defaultValue, name, key, actionConfKey } = v;
      let tag: Tags = null;
      this.actionData.some(i => i.inputTags.find(n => {
        if (key === actionConfKey) {
          if (n.oldKey === key) {
            tag = n;
            return true;
          }
        } else {
          if (n.newKey === key) {
            tag = n;
            return true;
          }
        }
      }));
      /*     if (name !== tag.oldName && key !== tag.oldKey) {
            tag.newName = null;
            tag.newKey = null;
          } */
      tag.defaultValue = defaultValue;
      this.tag.pushTag(tag);
    })
  }
  /**循环出actionData*/
  private circulActionRels(actionRels: Actions[], data: GetActionByKey[], paras: Paras[]) {
    actionRels.forEach(v => {
      let { key, outputRefs, paraAlias } = v;
      const actionItem = data.find(v => v.key === key);
      if (actionItem) {
        this.actionDataPush(actionItem, this.actionData.length);
        if (outputRefs) {
          outputRefs = JSON.parse(outputRefs as string) as OutputRefs[];
          outputRefs.forEach(i => {
            const inputIndex = this.actionData[v.order - 1].inputTags.findIndex(v => v.oldKey === i.inputKey);
            let inputTag = this.actionData[v.order - 1].inputTags[inputIndex];
            const outputIndex = this.actionData[i.refOrder - 1].outputTags.findIndex(n => n.oldKey === i.refOutputKey);
            if (outputIndex === -1) {
              return;
            }
            inputTag.refOrder = `${i.refOrder - 1},${outputIndex}`;
            const outTag = this.actionData[i.refOrder - 1].outputTags[outputIndex];
            if (!outTag?.bindTag) {
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
            if (inputTag) {
              inputTag.newKey = i.alias;
              inputTag.newName = paras.find(n => n.key === inputTag.newKey).name;
              inputTag = this.tag.pushTag(inputTag);
            }
          })
        }
      }
    });
  }
  /**接受到action详情提取有用信息*/
  actionDataPush(data: GetActionByKey, index: number) {
    const { inputParas, outputParas, key, name } = data;
    const tagData = this.tag.tagData;
    this.actionData.splice(index, 0, { key, name, inputTags: [], outputTags: [] });
    this.bindDispose('add', this.addActionIndex);
    this.tagPush(index, inputParas, 'inputTags');
    this.tagPush(index, outputParas, 'outputTags');
    this.onCancel();
  }
  /**中间插入或删除进行数据绑定关系进行处理*/
  private bindDispose(key: 'delect' | 'add', index: number) {
    this.actionData.forEach((v, actionIndex) => {
      if (actionIndex >= index && v.outputTags.length > 0) {
        v.outputTags.forEach((i, tagIndex) => {
          i.refOrder = `${actionIndex},${tagIndex}`;
          i.bindTag && this.inputTagDispose(i, key, index);
        })
      }
    })
  }
  /**绑定的tag关系进行处理*/
  private inputTagDispose(tag: Tags, key: 'delect' | 'add', index: number) {
    console.log(tag);
    tag.bindTag.forEach(v => {
      if (v[0] >= index) {
        v[0] = key === 'delect' ? v[0] - 1 : v[0] + 1;
        let inputTag = this.actionData[v[0]].inputTags[v[1]];
        if (inputTag) {
          const findTagData = this.tag.findTagData(inputTag);
          findTagData.bindTag = tag.bindTag;
          findTagData.refOrder = tag.refOrder;
          inputTag = findTagData
        }
      }
    })
  }
  /**添加tag*/
  private tagPush(actionLength: number, paras: InputParas[] | OutputParas[], type: 'inputTags' | 'outputTags') {
    paras.forEach((v, index) => {
      if (type === 'outputTags') {
        this.actionData[actionLength][type].push({ oldName: v.name, oldKey: v.key, actionKey: this.actionData[actionLength].key, actionConfKey: v.key, type, refOrder: `${actionLength},${index}`, tpe: v.tpe });
      } else {
        this.actionData[actionLength][type].push({ oldName: v.name, oldKey: v.key, actionKey: this.actionData[actionLength].key, actionConfKey: v.key, type, tpe: v.tpe });
      }
    })
  }
  /**提交*/
  submitForm() {
    if (!this.actionData.every(v => v.inputTags.every(i => this.tag.findTagIndex(i) >= 0))) {
      return this.hintMsg.error('请将输入参数全部点亮再进行操作');
    }
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
    const data: any = { name: this.formGroup.get('name').value, actionRels: [], paras: [] };
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
      const actionsItem: Actions = { key: v.key, order: actionIndex + 1 }
      if (outputRefs.length > 0) {
        actionsItem.outputRefs = JSON.stringify(outputRefs);
      }
      if (paraAlias.length > 0) {
        actionsItem.paraAlias = JSON.stringify(paraAlias);
      }
      data.actionRels.push(actionsItem);
    })
    this.tag.tagData.forEach(v => {
      const paras: Paras = { actionConfKey: v.actionConfKey, actionKey: v.actionKey };
      if (v.newKey && v.newName) {
        paras.key = v.newKey;
        paras.name = v.newName;
      }
      if (v.defaultValue) {
        paras.defaultValue = v.defaultValue;
      }
      if (!v.refOrder) {
        data.paras.push(paras)
      }
    })
    switch (this.parentKey) {
      case 'open_edit':
        data.key = this.data.key;
        data.id = this.data.id;
        this.byVal.sendMeg({ key: 'edit_start', data });
        break;
      case 'open_add':
        this.byVal.sendMeg({ key: 'add_start', data });
        break
      default:
        break;
    }
  }

  /**修改参数完成*/
  handleEditTagSuccess(data: Tags) {
    let inputTag = this.actionData[this.tagEditIndex.action].inputTags[this.tagEditIndex.tag]
    const tag = this.tag.findTagData(inputTag);
    inputTag.refOrder = data.refOrder;
    inputTag.defaultValue = data.defaultValue;
    inputTag.newKey = data.newKey;
    inputTag.newName = data.newName;
    if (!this.hasError(data.refOrder) && !this.hasError(data.newKey) && !this.hasError(data.newName) && !this.hasError(data.defaultValue)) {
      this.tag.removeTag(tag);
    } else {
      if (tag && ((tag.newKey && tag.newName) || tag.refOrder || tag.defaultValue)) {
        this.tag.removeTag(tag);
        this.tag.pushTag(inputTag);
      } else {
        this.tag.pushTag(inputTag);
      }
      if (data.refOrder) {
        const ref = data.refOrder.split(',').map(Number);
        const outTag = this.actionData[ref[0]].outputTags[ref[1]];
        if (outTag && outTag.bindTag) {
          outTag.bindTag.push([this.tagEditIndex.action, this.tagEditIndex.tag]);
        } else if (outTag && !outTag.bindTag) {
          outTag.bindTag = [[this.tagEditIndex.action, this.tagEditIndex.tag]]
        }
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
          switch (this.tagEditData.tpe) {
            case 8:
              if (i.tpe === 1) {
                this.editTagBind.push({ value: i.refOrder, name: `action${index + 1}的输出参数名:${i.oldName},参数键值：${i.oldKey}` })
              }
              break;
            case 9:
              if (i.tpe === 2) {
                this.editTagBind.push({ value: i.refOrder, name: `action${index + 1}的输出参数名:${i.oldName},参数键值：${i.oldKey}` })
              }
              break;
            case 10:
              if (i.tpe === 7) {
                this.editTagBind.push({ value: i.refOrder, name: `action${index + 1}的输出参数名:${i.oldName},参数键值：${i.oldKey}` })
              }
              break;
            default:
              if (tpe === i.tpe) {
                this.editTagBind.push({ value: i.refOrder, name: `action${index + 1}的输出参数名:${i.oldName},参数键值：${i.oldKey}` })
              }
              break;
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
    action.outputTags && action.outputTags.forEach(v => {
      if (v.bindTag) {
        const tag = this.tag.findTagData(v);
        v.bindTag.forEach(i => {
          if (i[0] >= 0 && i[1] >= 0) {
            this.actionData[i[0]].inputTags[i[1]].refOrder = null
          }
        })
        v.bindTag = null;
        if (tag) this.tag.removeTag(tag);
      }
    })
    this.actionData.splice(index, 1);
    this.bindDispose('delect', index);
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
    this.visible = false;
    const timer = setTimeout(() => {
      this.modalKey = ''
      clearTimeout(timer);
    }, 100);
  }
  ngOnDestroy(): void {
    this.sub && this.sub.unsubscribe()
  }
  /**判断字符是否存在*/
  private hasError(value) {
    return value != null && value != undefined && value != '';
  }
}
