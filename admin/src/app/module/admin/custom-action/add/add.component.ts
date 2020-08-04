import { AddAction, InputParas, OutputParas } from 'src/app/services/entity';
import { NzMessageService } from 'ng-zorro-antd';
import { AbstractControl } from '@angular/forms';
import { Validators, FormGroup, FormArray } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { ByValueService } from 'src/app/services/by-value.service';
import { Config } from 'src/app/Config';


@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.less']
})
export class AddComponent implements OnInit {
  /**导入的json*/
  inputJson: string;
  /**控制弹框是否打开*/
  visible = false;
  formGroup: FormGroup;
  ActionTpe = Config.Actiontpe;
  constructor(private fb: FormBuilder, private byVal: ByValueService, private hintMsg: NzMessageService) { }
  ngOnInit() {
    this.formGroup = this.fb.group({
      name: [null, [Validators.required]],
      key: [null, [Validators.required, Validators.pattern(/^[a-zA-Z_][a-zA-Z0-9_]{0,}$/)]],
      inputParas: this.fb.array([this.getInputParas]),
      outputParas: this.fb.array([this.getOutputParas])
    })
  }

  /**获取输入参数子控件配置*/
  private get getInputParas() {
    return this.fb.group({
      name: [null, Validators.required],
      key: [null, [Validators.required, Validators.pattern(/^[a-zA-Z_][a-zA-Z0-9_]{0,}$/)]],
      tpe: [null, Validators.required],
      values: [{ value: null, disabled: true }, [Validators.required]],
      constraint: [null],
      cascadeConstraint: [null],
      tip: [null],
      errTip: [null]
    })
  }
  /**获取输出参数子控件配置*/
  private get getOutputParas() {
    return this.fb.group({
      name: [null, Validators.required],
      key: [null, [Validators.required, Validators.pattern(/^[a-zA-Z_][a-zA-Z0-9_]{0,}$/)]],
      tpe: [null, Validators.required]
    })
  }
  /**获取输入参数控件*/
  get inputParas(): FormArray {
    return this.formGroup.get('inputParas') as FormArray;
  }
  /**获取输出参数控件*/
  get outputParas(): FormArray {
    return this.formGroup.get('outputParas') as FormArray;
  }

  /**移除子控件*/
  handleDelParas(i: number, key: 'inputParas' | 'outputParas') {
    this[key].removeAt(i)
  }
  /**增加子控件*/
  handleAddParas(e: Event, key: 'inputParas' | 'outputParas') {
    e.stopPropagation();
    this[key].push(this.getInputParas);
  }

  handleParasTpeChange(val, v: AbstractControl) {
    val === 8 || val === 10 ? v.get('values').enable({ onlySelf: true }) : v.get('values').disable({ onlySelf: true });
  }

  hasError(i: AbstractControl) {
    return !i.pristine && !i.valid;
  }
  /**导入json填充form表单*/
  async patchValue() {
    if (this.inputJson == null || this.inputJson == undefined || this.inputJson == '') {
      return this.hintMsg.error('请输入要导入的JSON');
    }
    const value = JSON.parse(this.inputJson) as AddAction;
    const { inputParas, outputParas } = value;
    await this.handelFillerParas(inputParas, 'inputParas');
    await this.handelFillerParas(outputParas, 'outputParas');
    inputParas.forEach(({ tpe }, index) => {
      if (tpe === 8 || tpe === 10) {
        this.handleParasTpeChange(tpe, this.inputParas.controls[index])
      }
    });
    this.formGroup.patchValue(value);
    this.onCancel();
  }
  /**循环填充输入 | 输入参数*/
  private async handelFillerParas(paras: InputParas[] | OutputParas[], key: 'inputParas' | 'outputParas') {
    let index = 0;
    if (paras && paras.length > this[key].controls.length) {
      for (index = 0; index < paras.length; index++) {
        this[key].push(this.getInputParas);
        if (paras.length === this[key].controls.length) { return };
      }
    } else if (paras && paras.length < this[key].controls.length) {
      for (index = this[key].controls.length; index >= paras.length; index--) {
        this.handleDelParas(index, key);
        if (index === paras.length) return;
      }
    }
  }
  /**聚合form表单控件检验表单是否符合要求，符合发出添加请求*/
  submitForm() {
    if (this.formGroup.valid) {
      console.log(this.formGroup.value);
      const data = this.formGroup.value;
      this.byVal.sendMeg({ key: 'add_start', data })
    } else {
      for (const i in this.formGroup.controls) {
        this.formGroup.controls[i].markAsDirty();
        this.formGroup.controls[i].updateValueAndValidity();
        if (i === 'inputParas') {
          const fromArray = this.formGroup.controls[i] as FormArray;
          const inputParas = fromArray.controls;
          inputParas.forEach((v: FormGroup) => {
            for (const key in v.controls) {
              v.controls[key].markAsDirty();
              v.controls[key].updateValueAndValidity();
            }
          })
        }
      }
    }
  }
  /**关闭 | 关闭 弹框*/
  onCancel() {
    this.visible = !this.visible;
  }
  /**键值命名不符合规则错误提示*/
  handleGetErrorTip(abs: AbstractControl) {
    return abs && abs.hasError('pattern') ? '键值命名规则不正确，应以字母或者下划线开头,由字母数字下划线组成' : '请输入名称';
  }
}
