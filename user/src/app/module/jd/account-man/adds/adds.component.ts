import { ByValueService } from 'src/app/services/by-value.service';
import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-adds',
  templateUrl: './adds.component.html',
  styleUrls: ['./adds.component.less']
})
export class AddsComponent implements OnInit {
  inputValueType = true;
  inputValue: string;
  data: string[][] = [];
  sub: Subscription;
  constructor(private byVal: ByValueService) { }

  ngOnInit() {
    this.sub = this.byVal.getMeg().subscribe((res) => {
      if (res.key === 'ADDS_MULTIPLE_ACOUNTS') {
        this.inputValue = '';
        this.inputValueType = true;
      }
    })
  }

  formatInputValue() {
    if (!this.inputValue || this.inputValue.length < 1) return;
    const value = this.inputValue.split('\n')
    this.data = value.map(v => v.split('----'));
    console.log(this.data);
    this.inputValueType = false;
  }

  adds() {
    this.byVal.sendMeg({ key: 'ADDS_START', data: this.inputValue.split('\n').join(';') })
  }
  handleCancel() {
    this.inputValueType = true;
  }
  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
   this.sub &&  this.sub.unsubscribe();
  }
}
