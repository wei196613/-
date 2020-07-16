import { ByValueService } from 'src/app/services/by-value.service';
import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-adds',
  templateUrl: './adds.component.html',
  styleUrls: ['./adds.component.less']
})
export class AddsComponent implements OnInit {

  inputValueType = true;
  inputValue: string;
  data: string[][] = [];

  constructor(private byVal: ByValueService) { }

  ngOnInit() {

  }

  formatInputValue() {
    if (!this.inputValue || this.inputValue.length < 1) return;
    const value = this.inputValue.split('\n')
    this.data = value.map(v => v.split('----'));
    console.log(this.data);
    this.inputValueType = false;
  }

  adds() {
    this.byVal.sendMeg({ key: 'adds_start', data: this.inputValue.split('\n').join(';') })
  }
  handleCancel() {
    this.inputValueType = true;
  }
  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.

  }
}
