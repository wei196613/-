import { NzMessageService } from 'ng-zorro-antd';
import { Subscription } from 'rxjs';
import { AbstractControl, ControlContainer, FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { Component, OnInit, Input, Output, EventEmitter, Optional, Host, SkipSelf } from '@angular/core';
import { Paras, CascadeConstraint, Constraint } from 'src/app/services/my-task.service';
import { ByValueService } from 'src/app/services/by-value.service';
import { format } from 'date-fns';
import { GenTemXLSXService } from 'src/app/services/gen-tem.service';

@Component({
  selector: 'app-input-tpe',
  templateUrl: './input-tpe.component.html',
  styleUrls: ['./input-tpe.component.less']
})
export class InputTpeComponent implements OnInit {
  @Input() isAdds = false; // 是否启用批量添加默认不启用
  @Input() paras: Paras[];
  @Input() data: string;
  parameterArr: { key: string, name: string, checked: boolean }[] = []; // 记录该任务的所有参数
  control: AbstractControl;
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
    console.log(this.SubFromGroup);
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
          this.byVal.sendMeg({ key: 'parse_excel_start', data: this.parameterArr.filter(v => v.checked).map(i => i.key) })
          break;
        default:
          break;
      }
    })
    this.data && this.patchValue();
    this.valueSub = this.SubFromGroup && this.SubFromGroup.valueChanges ? this.SubFromGroup.valueChanges.subscribe(() => {
      this.byVal.sendMeg({ key: 'sub_form_valid', data: this.SubFromGroup.valid || this.SubFromGroup.disabled });
    }) : null;
  }

  sendSubFormParams() {
    const data = { difParamsName: null, subParams: null, paramsName: null };
    data.difParamsName = this.parameterArr.filter(v => !v.checked);
    data.subParams = this.getSubFormValue();
    data.paramsName = this.parameterArr.filter(v => v.checked)
    this.byVal.sendMeg({ key: 'sub_form_params', data })
  }

  patchValue() {
    let values: { [s: string]: any };
    values = JSON.parse(this.data);
    for (const key in values) {
      if (Object.prototype.toString.call(values[key]) == '[object Array]') {
        const formArray = this.SubFromGroup.get(key) as FormArray;
        if (formArray.controls) {
          (values[key] as string[] | number[]).forEach((value, index) => {
            if (index != 0) {
              formArray.push(this.fb.control(null))
            }
          });
        }
      }
    }
    this.SubFromGroup.patchValue(values)
  }
  /**整理form表单数据 isValidity为true仅跟新表单，检查表单的值是否有效 false则会发送提交*/
  private getSubFormValue(isValidity?: boolean) {
    for (const i in this.SubFromGroup.controls) {
      this.SubFromGroup.controls[i].markAsDirty();
      this.SubFromGroup.controls[i].updateValueAndValidity();
    }
    if (isValidity) return;
    if (this.SubFromGroup.valid) {
      const v = this.SubFromGroup.value;
      const data = [];
      for (const key in v) {
        let value = v[key]
        if (value !== null && value !== undefined && value !== '') {
          let dataItem: { [s: string]: any } = {};
          dataItem.key = key;
          const valueKey = this.getValueKey(value)
          if (valueKey === 'date') {
            dataItem.stringValue = format(value, 'yyyy-MM-dd HH:mm:ss')
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
  private getValueKey(v): string {
    switch (typeof v) {
      case 'string':
        return 'stringValue'
      case 'number':
        return 'numberValue'
      case 'boolean':
        return 'boolValue'
      case 'object':
        let s = '';
        if (Object.prototype.toString.call(v) === '[object Date]') {
          return "date"
        }
        if (typeof v[0] === 'number') {
          s = 'numberListValue'
        } else if (typeof v[0] === 'string') {
          s = 'stringListValue'
        }
        return s;
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
    const controlsConfig = {};
    if (this.paras) {
      this.paras.forEach(v => {
        const { key, tpe, name } = v;
        this.parameterArr.push({ key, name, checked: false });
        const constraint = v.constraint as Constraint;
        if (tpe === 6 || tpe === 7) {
          controlsConfig[key] = this.fb.array([null])
        } else {
          controlsConfig[key] = [null, []];
          if (tpe === 3) {
            controlsConfig[key][0] = false
          }
          if (constraint && constraint.required) {
            controlsConfig[key][1].push(Validators.required)
          }
          if (constraint && constraint.format) {
            controlsConfig[key][1].push(Validators.pattern(constraint.format))
          }
        }
      })
    }
    return controlsConfig
  }

  getFormArray(key: string) {
    if (this.SubFromGroup)
      return this.SubFromGroup.get(key) as FormArray;
  }

  removeField(absCol, key: string, e: MouseEvent): void {
    if (this.getFormArray(key).length > 1) {
      this.getFormArray(key).removeAt(absCol);
    }
    e && e.preventDefault();
  }

  addField(key: string, e?: MouseEvent): void {
    e && e.preventDefault();
    this.getFormArray(key).push(this.fb.control(null))
  }
  /**是否显示必填符号   **/
  getRequired(i: Paras): boolean {
    const constraint = i.constraint as Constraint;
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
    const cascadeConstraint = i.cascadeConstraint as CascadeConstraint;
    let isShow = true; // 默认显示
    if (cascadeConstraint) {
      const { key, max, min } = cascadeConstraint;
      if (key) {
        const v = this.SubFromGroup.get(key).value as number;
        if (v >= max && v <= min) {
          isShow = false
        }
      }
    }
    return isShow;
  }
  /**批量添加是否选中 并且 重新计算表单的值和校验状态。*/
  handleIsParaChange(e: boolean, i: Paras) {
    const abs = this.SubFromGroup.get(i.key);
    this.parameterArr.forEach(v => {
      i.key === v.key ? v.checked = e : '';
    });
    if (abs) {
      e ? abs.disable() : abs.enable();
      // abs.updateValueAndValidity();
    }
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

  ngOnDestroy(): void {
    this.sub && this.sub.unsubscribe();
    this.valueSub && this.valueSub.unsubscribe();
  }
}
