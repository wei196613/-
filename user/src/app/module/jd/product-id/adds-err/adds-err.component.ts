import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-adds-err',
  templateUrl: './adds-err.component.html',
  styleUrls: ['./adds-err.component.less']
})
export class AddsErrComponent implements OnInit {

  @Input() data: { line: string, error: string }[];
  constructor() { }

  ngOnInit() {
  }
}
