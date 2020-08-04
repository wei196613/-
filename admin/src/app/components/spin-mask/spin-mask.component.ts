import { Component, OnInit } from '@angular/core';
import {AppSpinService} from './app-spin.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'spin-mask',
  templateUrl: './spin-mask.component.html',
  styleUrls: ['./spin-mask.component.less']
})
export class SpinMaskComponent {
  constructor(public s: AppSpinService) { }
}
