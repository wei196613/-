import { NzMessageService } from 'ng-zorro-antd';
import { Subscription } from 'rxjs';
import { AbstractControl, ControlContainer, FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { Component, OnInit, Input, Output, EventEmitter, Optional, Host, SkipSelf } from '@angular/core';
import { Paras, CascadeConstraint, Constraint } from 'src/app/services/my-task.service';
import { ByValueService } from 'src/app/services/by-value.service';
import { format } from 'date-fns';
import { GenTemXLSXService } from 'src/app/services/gen-tem.service';
import { constants } from 'buffer';
import { Config } from 'src/app/Config';

@Component({
  selector: 'app-input-tpe',
  templateUrl: './input-tpe.component.html',
  styleUrls: ['./input-tpe.component.less']
})
export class InputTpeComponent implements OnInit {
  /**是否启用批量添加默认不启用*/
  @Input() isAdds = false;
  @Input() paras: Paras[];
  @Input() data: string;
  /**批量参数选中变化*/
  @Output() batchChange = new EventEmitter<boolean>();
  /**分割符select数据*/
  spiltList = Config.spiltList;
  /**控制 stringList 和 numberList 输入方式*/
  inputMethod: { key: string, tpe: number, way: 'string' | 'list' }[] = [];
  parameterArr: { key: string, name: string, checked: boolean, tpe: number, bindKey?: string[] }[] = []; // 记录该任务的所有参数
  SubFromGroup: FormGroup;
  passwordVisible = false;
  sub: Subscription;
  valueSub: Subscription;
  constructor(
    private fb: FormBuilder,
    private byVal: ByValueService,
    private genTemXLSX: GenTemXLSXService,
    private hintMsg: NzMessageService
  ) {

  }
  ngOnInit() {
    this.SubFromGroup = this.fb.group(this.controlsConfig());
    this.sub = this.byVal.getMeg().subscribe(res => {
      switch (res.key) {
        case 'gen_tem_start':
          this.genTem();
          break;
        case 'merge_task_params':
          this.mergeTaskParams(res.data?.isValidity)
          break;
        case 'parse_excel_success':
          this.sendSubFormParams();
          break;
        case 'parse_excel':
          this.byVal.sendMeg({
            key: 'parse_excel_start', data: this.parameterArr.filter(v => v.checked).map(({ key, tpe }) => {
              if (tpe === 6) {
                return { key, spilt: this.SubFromGroup.value.spilt }
              }
              return { key }
            })
          })
          break;
        default:
          break;
      }
    })
    this.data && this.paras && this.paras.length > 0 && this.patchValue();
    this.valueSub = this.SubFromGroup && this.SubFromGroup.valueChanges ? this.SubFromGroup.valueChanges.subscribe(() => {
      this.byVal.sendMeg({ key: 'sub_form_valid', data: this.SubFromGroup.valid || this.SubFromGroup.disabled });
    }) : null;
  }

  /**获取输入方式*/
  getInputMethod(key: string) {
    const { way } = this.inputMethod.find(v => v.key === key)
    return way === 'list'
  }
  /**发送subForm值*/
  sendSubFormParams() {
    const data = { difParamsName: null, subParams: null, paramsName: null };
    data.difParamsName = this.parameterArr.filter(v => !v.checked).map(({ key, name, tpe }) => tpe === 6 ? { key, name, tpe, spilt: this.SubFromGroup.value.spilt } : { key, name, tpe });
    data.subParams = this.getSubFormValue();
    data.paramsName = this.parameterArr.filter(v => v.checked);
    console.log(data);

    this.byVal.sendMeg({ key: 'sub_form_params', data })
  }

  patchValue() {
    let values: { [s: string]: any };
    values = JSON.parse(this.data);
    for (const key in values) {
      if (Object.prototype.toString.call(values[key]) == '[object Object]') {
        if (values[key].randomTime > 0) {
          values[key].isRandom = true;
          (this.SubFromGroup.get(key) as FormGroup)?.addControl('randomTime', this.fb.control(null, [Validators.required]))
          values[key].randomTime = Number(values[key].randomTime);
        }
        let joinStr = '\n';
        if (values[key].spilt != null && values[key].spilt != undefined && values[key].spilt !== "") {
          joinStr = values[key].spilt;
          values[key].spiltType = 2;
          this.handleSpiltChange(2, key);
        }
        values[key].list = values[key].value.join(joinStr);
      }
    }
    this.SubFromGroup.patchValue(values)
  }
  /**整理form表单数据 isValidity为true仅跟新表单，检查表单的值是否有效 false则会发送提交*/
  private getSubFormValue(isValidity?: boolean) {
    for (const i in this.SubFromGroup.controls) {
      const controls = this.SubFromGroup.controls[i]
      controls.markAsDirty();
      controls.updateValueAndValidity();
      if ((controls as FormGroup).controls) {
        const subControl = (controls as FormGroup).controls;
        for (const v in subControl) {
          subControl[v].markAsDirty();
          subControl[v].updateValueAndValidity();
        }
      }
    }
    if (isValidity) return;
    if (this.SubFromGroup.valid) {
      const v = this.SubFromGroup.value;
      if (this.inputMethod.length > 0) {
        this.inputMethod.forEach(item => {
          if (item.tpe === 7) {
            if (v[item.key].list) {
              v[item.key].list = v[item.key].list.split('\n').map(Number).filter(i => i != null && i != undefined && i != '');
            } else {
              delete v[item.key].list
            }
          } else if (item.tpe === 6) {
            if (v[item.key].list) {
              if (v[item.key].spiltType == 1) {
                v[item.key].list = v[item.key].list.split(/[\s\n]/).filter(i => i != null && i != undefined && i != '');
              } else {
                v[item.key].list = v[item.key].list.split(v[item.key].spilt).filter(i => i != null && i != undefined && i != '');
              }
            } else {
              delete v[item.key].list
            }
          }
        })
      }
      const data = [];
      for (const p of this.paras) {
        const value = this.SubFromGroup.get(p.key)?.value;
        const dataItem: { [s: string]: any } = {};
        if (value !== null && value !== undefined && value !== '') {
          const valueKey = this.getValueKey(p.tpe);
          dataItem.key = p.key;
          if (p.tpe === 6) {
            dataItem[valueKey] = value.list;
            if (value.isRandom) {
              dataItem.randomTime = value.randomTime
            }
            if (value.spiltType == 1) {
              dataItem.spilt = "";
            } else {
              dataItem.spilt = value.spilt;
            }
            console.log(dataItem);
          } else if (p.tpe === 7) {
            dataItem[valueKey] = value.list;
            if (value.isRandom) {
              dataItem.randomTime = value.randomTime
            }
          } else if (p.tpe === 4 || p.tpe === 5) {
            dataItem[valueKey] = format(new Date(value), 'yyyy-MM-dd HH:mm:ss');
          } else {
            dataItem[valueKey] = value;
          }
          data.push(dataItem);
        }
      }
      return data;
    }
  }
  // 整理表单填写内容
  private mergeTaskParams(isValidity?: boolean) {
    if (isValidity) return this.getSubFormValue(isValidity);
    const data = JSON.stringify(this.getSubFormValue());
    if (this.SubFromGroup.valid) {
      this.byVal.sendMeg({ key: 'merge_task_params_success', data })
    }
  }

  // 获取value值的键值
  private getValueKey(tpe: number): string {
    switch (tpe) {
      case 1:
        return 'numberValue'
      case 2:
        return 'stringValue'
      case 3:
        return 'boolValue'
      case 4:
        return 'stringValue'
      case 5:
        return 'stringValue'
      case 6:
        return 'stringListValue'
      case 7:
        return 'numberListValue'
      case 8:
        return 'numberValue'
      case 9:
        return 'stringValue'
      case 10:
        return 'numberListValue'
    }
  }
  /**获取提示*/
  getPlaceHolder(i: Paras) {
    return i && i.tip ? i.tip : '';
  }
  /**错误提示*/
  getEorrorTip(i: Paras) {
    return i && i.errTip ? i.errTip : '';
  }

  /**生成表单控件配置对象*/
  private controlsConfig() {
    const controlsConfig: { [s: string]: any } = {};
    if (this.paras) {
      this.paras.forEach(v => {
        const { key, tpe, name } = v;
        const constraint = v.constraint as Constraint;
        const cascadeConstraint = v.cascadeConstraint as CascadeConstraint[];
        this.parameterArr.push({ key, name, checked: false, tpe });
        if (tpe === 6) {
          controlsConfig[key] = this.fb.group({
            list: [null, this.validation(constraint)],
            isRandom: [false, [this.listSome(key)]],
            spiltType: [1, [Validators.required]]
          })
          this.inputMethod.push({ key, tpe, way: 'string' });
        } else if (tpe === 7) {
          controlsConfig[key] = this.fb.group({
            list: [null, this.validation(constraint)],
            isRandom: [false, [this.listSome(key)]]
          })
          this.inputMethod.push({ key, tpe, way: 'string' });
        } else {
          controlsConfig[key] = [null, this.validation(constraint)];
          if (tpe === 3) {
            controlsConfig[key][0] = false
          }
        }
        // 将key保存到关联的key为批量添加导出的excel做准备
        if (cascadeConstraint && cascadeConstraint.length > 0) {
          cascadeConstraint.forEach(casc => {
            const parameter = this.parameterArr.find(p => p.key === casc.bindParaKey);
            if (parameter) {
              parameter.bindKey = parameter.bindKey ? parameter.bindKey.concat(v.key) : [v.key];
            }
          })
        }
      })
    }
    return controlsConfig
  }
  /**生成检验form表单输入值规则*/
  private validation(constraint: Constraint) {
    const validationArr = [];
    if (constraint && constraint.required) {
      validationArr.push(Validators.required)
    }
    if (constraint && constraint.format) {
      validationArr.push(Validators.pattern(constraint.format))
    }
  }
  /**list参数随机数变化事件*/
  listSome(key: string) {
    return (control: AbstractControl) => {
      if (this.SubFromGroup && this.SubFromGroup.get(key)) {
        if (control.value) {
          (this.SubFromGroup.get(key) as FormGroup)?.addControl('randomTime', this.fb.control(null, [Validators.required]))
        } else {
          (this.SubFromGroup.get(key) as FormGroup)?.removeControl('randomTime');
        }
      }
    }
  }

  /**是否显示必填符号**/
  getRequired(i: Paras): boolean {
    const constraint = i.constraint as Constraint;
    const cascadeConstraint = i.cascadeConstraint as CascadeConstraint[];
    if (cascadeConstraint && cascadeConstraint.length > 0) {
      for (const c of cascadeConstraint) {
        const { bindParaKey, matchArr, constraint } = c;
        const abs = this.SubFromGroup.get(bindParaKey);
        if (matchArr.some(v => v == abs.value)) {
          if (constraint && constraint.required) {
            return true;
          }
        }
      }
    }
    return constraint && constraint.required
  }
  /** 获取最小值 没有则返回负无穷*/
  getMin(i: Paras): number {
    const constraint = i.constraint as Constraint;
    return constraint ? constraint.min : -Infinity;
  }
  /**获取最大值 没有设置则返回正无穷*/
  getMax(i: Paras): number {
    const constraint = i.constraint as Constraint;
    return constraint ? constraint.max : Infinity;
  }
  /**是否显示该文本框*/
  getIsShow(i: Paras): boolean {
    const cascadeConstraint = i.cascadeConstraint as CascadeConstraint[];
    if (cascadeConstraint) {
      for (const c of cascadeConstraint) {
        const { bindParaKey, matchArr, constraint } = c;
        const abs = this.SubFromGroup.get(bindParaKey);
        if (matchArr.some(v => v == abs.value)) {
          const verifyArr = [];
          if (constraint && constraint.required) {
            verifyArr.push(Validators.required);
          }
          if (constraint && constraint.format) {
            verifyArr.push(Validators.pattern(constraint.format))
          }
          if (constraint && constraint.max) {
            verifyArr.push(Validators.maxLength(constraint.max))
          }
          if (constraint && constraint.min) {
            verifyArr.push(Validators.minLength(constraint.min))
          }
          this.SubFromGroup.addControl(i.key, this.fb.control(null, verifyArr));
          return true;
        } else {
          this.SubFromGroup.removeControl(i.key);
        }
      }
      return false;
    }
    return true;
  }
  /**批量添加是否选中 并且 重新计算表单的值和校验状态。*/
  handleIsParaChange(e: boolean, key: string) {
    let abs = this.SubFromGroup.get(key);
    const parameter = this.parameterArr.find(v => v.key === key);
    if (parameter) {
      parameter.checked = e;
      if (parameter.bindKey) {
        parameter.bindKey.forEach(v => {
          this.handleIsParaChange(e, v)
        })
      }
    }
    if (parameter.tpe === 6 || parameter.tpe === 7) {
      if (parameter.tpe === 6) {
        abs.patchValue({
          spiltType: e ? 2 : 1
        })
      }
      abs = abs.get('list');
    }
    if (abs) {
      e ? abs.disable() : abs.enable();
      abs.updateValueAndValidity();
    }
    this.batchChange.emit(this.parameterArr.some(v => v.checked));
  }
  /**生成模板并保存*/
  private genTem() {
    const labelArr = this.parameterArr.filter(({ checked }) => checked).map(v => v.name);
    if (labelArr.length === 0) {
      this.hintMsg.error('请勾选要批量导入的参数')
      return false;
    }
    this.genTemXLSX.exportExcel(labelArr);
  }
  /**切换输入方式*/
  handleSwitchInput(i: Paras) {
    const { key, tpe } = i;
    let spilt = ',';
    if (tpe === 6) {
      spilt = this.SubFromGroup.get(key).get('spilt').value;
      if (spilt == null || spilt == undefined || spilt == '') {
        return this.hintMsg.error('请输入分隔符后在尝试');
      }
    }
    const constraint = i.constraint as Constraint;
    const arr = [];
    let value = this.SubFromGroup.get(key).get('list').value;
    if (constraint) {
      if (constraint.required) {
        arr.push(Validators.required)
      }
    }
    const v = this.inputMethod.find(v => v.key === key);
    if (v.way === 'list') {
      v.way = 'string';
      if (value) value = value.join(spilt);
      (this.SubFromGroup.get(key) as FormGroup).removeControl('list');
      (this.SubFromGroup.get(key) as FormGroup).addControl('list', this.fb.control(value))
    } else {
      v.way = 'list';
      if (value) {
        value = value.split(spilt);
      } else {
        value = [null];
      }
      (this.SubFromGroup.get(key) as FormGroup).removeControl('list');
      (this.SubFromGroup.get(key) as FormGroup).addControl('list', this.fb.array(value))
    }
  }
  /**numberList stringList的检验规则*/
  private constSome(constraint: Constraint) {
    return (c: AbstractControl) => {

    }
  }
  /**切换切割字符*/
  handleSpiltChange(e: number, key: string) {
    if (e === 2) {
      (this.SubFromGroup.get(key) as FormGroup).addControl('spilt', this.fb.control(null, [Validators.required]))
    } else {
      (this.SubFromGroup.get(key) as FormGroup).removeControl('spilt');
    }
  }
  ngOnDestroy(): void {
    this.sub && this.sub.unsubscribe();
    this.valueSub && this.valueSub.unsubscribe();
  }
  /**批量选择是否选中*/
  handleIsParaChecked(key: string) {
    return this.parameterArr.find(v => v.key === key)?.checked;
  }
  handleGetSpiltTypeDis(key: string) {
    return this.parameterArr?.find(v => v.key === key)?.checked;
  }
}
