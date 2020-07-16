import { FormBuilder } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ByValueService } from 'src/app/services/by-value.service';

@Component({
  selector: 'app-title',
  templateUrl: './title.component.html',
  styleUrls: ['./title.component.less']
})
export class TitleComponent implements OnInit {
  @Input() placeholder: string;
  @Input() titleType: boolean = false;
  @Input() selectAll: [{ placeholder: string; name: string; arr: [{ value: number; label: string, name: string }] }];
  @Input() dateMsg: string;
  @Output() queryClick = new EventEmitter<string>();
  @Output() clearClick = new EventEmitter();
  formGroup: FormGroup
  constructor(private byVal: ByValueService, private fb: FormBuilder) { }

  ngOnInit() {
    this.formGroup = this.fb.group({
      msg: [null],
      selestFirst: [null],
      selestTwo: [null],
      date: [null]
    })
  }
  /**
   * handleQuery 查询
   */
  public handleQuery() {
    this.byVal.sendMeg({ key: 'title_query', data: this.formGroup.value })
    this.queryClick.emit(this.formGroup.get("msg").value)
  }
  clear() {
    this.formGroup.patchValue({
      msg: null,
      selestFirst: null,
      selestTwo: null,
      date: null
    })
    this.byVal.sendMeg({ key: 'title_clear', data: this.formGroup.value });
    this.clearClick.emit();
  }
  get inputValue() {
    return this.formGroup.value.msg
  }
  setInputValue() {
    this.formGroup.patchValue({
      msg: null
    })
  }
}
