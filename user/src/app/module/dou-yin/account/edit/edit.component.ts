import { AccountItem } from 'src/app/services/dy/dy-account.service';
import { ByValueService } from 'src/app/services/by-value.service';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.less']
})
export class EditComponent implements OnInit {
  @Input() data: AccountItem
  formGroup: FormGroup;

  constructor(private fb: FormBuilder, private byVal: ByValueService) { }



  ngOnInit() {
    this.formGroup = this.fb.group({
      id: [this.data.id, [Validators.required]],
      weiboAccount: [this.data.weibo, [Validators.required]],
      weiboPswd: [this.data.weiboPswd, [Validators.required]]
    })
  }

  submitForm() {
    const data = this.formGroup.value;
    console.log(data);
    if (this.formGroup.valid) {
      const data = this.formGroup.value;
      // console.log(data);
      this.byVal.sendMeg({ key: 'edit_start', data })
    } else {
      for (const i in this.formGroup.controls) {
        this.formGroup.controls[i].markAsDirty();
        this.formGroup.controls[i].updateValueAndValidity();
      }
    }
  }
}


/*
  formGroup: FormGroup;
  checkAll = [
    { value: 1, label: 'QQ', checked: false },
    { value: 2, label: '微博', checked: false },
    // { value: 3, label: '手机号', checked: false }
  ]
  constructor(private fb: FormBuilder, private byVal: ByValueService) { }

  // 是否选中qq号登录
  get qqType(): boolean {
    if (this.formGroup)
      return this.formGroup.get('checkList').value.some(v => v === 1);
    return false;
  }
  // 是否选中微博登录
  get wbType(): boolean {
    if (this.formGroup)
      return this.formGroup.get('checkList').value.some(v => v === 2);
    return false;
  }
  // 是否选中手机号登录
  get mobileType(): boolean {
    if (this.formGroup)
      return this.formGroup.get('checkList').value.some(v => v === 3);
    return false;
  }

  ngOnInit() {
    this.formGroup = this.fb.group({
      checkList: [[], [Validators.required]]
    })
  }

  submitForm() {
    const data = this.formGroup.value;
    console.log(data);
    if (this.formGroup.valid) {
      const data = this.formGroup.value;
      console.log(data);
      // this.byVal.sendMeg({ key: 'add', data })
    } else {
      for (const i in this.formGroup.controls) {
        this.formGroup.controls[i].markAsDirty();
        this.formGroup.controls[i].updateValueAndValidity();
      }
    }
  }
  // checkbox 取消选中
  onCheckCancel(n: number) {
    if (this.formGroup) {
      const [key1, key2] = this.formKey(n);
      this.formGroup.removeControl(key1);
      this.formGroup.removeControl(key2);
      const v: number[] = this.formGroup.get('checkList').value
      this.formGroup.patchValue({
        checkList: v.filter(v => v !== n)
      });
    }
  }
  // checkbox 选中发生事件
  onCheck(n: number) {
    if (this.formGroup) {
      const [key1, key2] = this.formKey(n);
      this.formGroup.registerControl(key1, new FormControl(null, Validators.required));
      this.formGroup.registerControl(key2, new FormControl(null, Validators.required));
      const v: number[] = this.formGroup.get('checkList').value
      this.formGroup.patchValue({
        checkList: [...v, n]
      });
    }
  }

  formKey(n: number) {
    let formKey1 = '';
    let formKey2 = '';
    switch (n) {
      case 1:
        formKey1 = 'qq';
        formKey2 = 'qqPwd';
        break;
      case 2:
        formKey1 = 'wb';
        formKey2 = 'wbPwd';
        break;
      case 3:
        formKey1 = 'mb';
        formKey2 = 'mbPwd';
        break;

      default:
        break;
    }
    return [formKey1, formKey2];
  }

  // checkbox选中变化发生事件
  checkChange(e: boolean, n: number) {
    this.checkAll.forEach(({ value }, index) => {
      if (value === n) {
        this.checkAll[index].checked = e;
      }
    })
    e ? this.onCheck(n) : this.onCheckCancel(n);
  }

*/