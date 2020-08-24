import { FormGroup, FormBuilder, Validators, FormArray, AbstractControl, ControlContainer } from '@angular/forms';
import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, Output, EventEmitter, Optional, Host, SkipSelf, Input } from '@angular/core';

@Component({
  selector: 'app-auth-code',
  templateUrl: './auth-code.component.html',
  styleUrls: ['./auth-code.component.less']
})
export class AuthCodeComponent implements OnInit, AfterViewInit {
  @Input() formControlName: string;
  control: AbstractControl;
  @Output() formValueChange = new EventEmitter();
  @ViewChild('myInput') myInput: ElementRef;
  formGroup: FormGroup;
  constructor(private fb: FormBuilder, @Optional() @Host() @SkipSelf()
  private controlContainer: ControlContainer) { }

  ngOnInit(): void {
    console.log(this.formConfig);
    this.formGroup = this.fb.group({
      totp: this.fb.array(this.formConfig)
    })
    if (this.controlContainer) {
      if (this.formControlName) {
        this.control = this.controlContainer.control.get(this.formControlName);
      } else {
        console.warn('Missing FormControlName directive from host element of the component');
      }
    } else {
      console.warn('Can\'t find parent FormGroup directive');
    }
  }
  private get formConfig() {
    const arr = [null, null, null, null, null, null]
    return arr.map(v => this.fb.control(null, Validators.required))
  }
  /**
   * totp 表单数组控件
   */
  public get totp() {
    return this.formGroup?.get('totp') as FormArray;
  }
  /**文本输入框值变化*/
  private handleInputChange(value: number, index: number) {
    if (index < 5) {
      this.myInput.nativeElement.children[index + 1].children[0].focus();
    } else {
      this.myInput.nativeElement.children[index]?.children[0]?.blur();
    }
    if (this.formGroup.valid) {
      this.control.patchValue(this.totp.value.join(''));
      this.formValueChange.emit(this.totp.value.join(''));
    }
  }
  ngAfterViewInit() {
    this.myInput.nativeElement.children[0].children[0].focus();
  }
  /**删除事件*/
  private keyboardDelete(index: number) {
    if (index > 0) {
      const v = this.totp.controls[index];
      if (v.value >= 0) {
        v.patchValue(null);
      }
    }
  }

  /**键盘按下操作*/
  handleKeydown(e: KeyboardEvent, index: number) {
    if (e.key === 'Backspace') {
      return false;
    }
    const key = parseInt(e.key);
    if (key >= 0 && key <= 9) {
      this.totp.controls[index].patchValue(key);
      this.handleInputChange(key, index);
    }
    return false;
  }
}
