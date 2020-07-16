import { NzMessageService } from 'ng-zorro-antd';
import { Subscription } from 'rxjs';
import { AbstractControl } from '@angular/forms';
import { Validators, FormGroup, FormArray } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { Component, OnInit, Input } from '@angular/core';
import { ByValueService } from 'src/app/services/by-value.service';
import { Config } from 'src/app/Config';
import { GetActionById, AddAction, InputParas, OutputParas } from 'src/app/services/entity';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.less', '../add/add.component.less']
})
export class EditComponent implements OnInit {
  /**导入的json*/
  inputJson: string;
  /**控制弹框是否打开*/
  visible = false;
  /**弹框类型*/
  modalKey = '';
  @Input() data: GetActionById;
  formGroup: FormGroup;
  ActionTpe = Config.Actiontpe;
  sub: Subscription;
  constructor(private fb: FormBuilder, private byVal: ByValueService, private hintMsg: NzMessageService) { }
  ngOnInit() {
    this.formGroup = this.fb.group({
      id: [null, [Validators.required]],
      name: [null, [Validators.required]],
      key: [null, [Validators.required]],
      inputParas: this.fb.array([this.getInputParas]),
      outputParas: this.fb.array([this.getOutputParas])
    })
    this.sub = this.byVal.getMeg().subscribe(v => {
      if (v.key === 'edit_error') {
        this.onCancel();
      }
    })
    this.patchValue();
  }
  /**填充form value*/
  private async patchValue(data?: AddAction) {
    const { inputParas, outputParas } = data ? data : this.data;
    await this.handelFillerParas(inputParas, 'inputParas');
    await this.handelFillerParas(outputParas, 'outputParas');
    inputParas.forEach(({ tpe }, index) => {
      if (tpe === 8 || tpe === 10) {
        this.handleParasTpeChange(tpe, this.inputParas.controls[index])
      }
    });
    this.formGroup.patchValue(data ? data : this.data);
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
      for (index = this[key].controls.length - 1; index >= paras.length; index--) {
        this.handleDelParas(index, key);
        if (index === paras.length) return;
      }
    }
  }

  /**获取输入参数子控件配置*/
  private get getInputParas() {
    return this.fb.group({
      id: [null],
      name: [null, Validators.required],
      key: [null, Validators.required],
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
      id: [null],
      name: [null, Validators.required],
      key: [null, Validators.required],
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

  submitForm() {
    const data = this.formGroup.value;
    data.outputParas.forEach(v => {
      if (v.id === null || v.id === undefined) {
        delete v.id;
      }
    });
    data.inputParas.forEach(v => {
      if (v.id === null || v.id === undefined) {
        delete v.id;
      }
    });
    this.byVal.sendMeg({ key: 'edit_start', data })
  }
  /**检查数据是否有改动*/
  query() {
    const v = this.formGroup.value;
    if (this.formGroup.valid) {
      console.log(JSON.stringify(v));
      console.log(JSON.stringify(this.data));
      if (JSON.stringify(v) === JSON.stringify(this.data)) {
        this.byVal.sendMeg({ key: 'close_modal' })
      } else {
        this.modalKey = 'open_confim';
      }
    } else {
      for (const i in this.formGroup.controls) {
        this.formGroup.controls[i].markAsDirty();
        this.formGroup.controls[i].updateValueAndValidity();
        if (i === 'inputParas' || i === 'outputParas') {
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
  /**将JSON自动填充进form表单中*/
  patchValueJSON() {
    if (this.inputJson == null || this.inputJson == undefined || this.inputJson == '') {
      return this.hintMsg.error('请输入要导入的JSON');
    }
    const value = JSON.parse(this.inputJson) as AddAction;
    this.patchValue(value);
    this.onCancel();
  }
  /**关闭 | 打开 对话框*/
  onCancel() {
    this.modalKey = '';
  }

  hasError(i: AbstractControl) {
    return !i.pristine && !i.valid;
  }

  ngOnDestroy(): void {
    this.sub && this.sub.unsubscribe()
  }
}
