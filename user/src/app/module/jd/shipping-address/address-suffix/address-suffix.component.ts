import { ByValueService } from 'src/app/services/by-value.service';
import { Component, OnInit, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { AddressSuffix } from 'src/app/services/jd/address.service';

@Component({
  selector: 'app-address-suffix',
  templateUrl: './address-suffix.component.html',
  styleUrls: ['./address-suffix.component.less']
})
export class AddressSuffixComponent implements OnInit {

  @Input() data: AddressSuffix[];
  checkData: AddressSuffix;
  visible = false;
  modalKey = '';
  sub: Subscription
  constructor(private byVal: ByValueService) { }

  ngOnInit() {
    this.sub = this.byVal.getMeg().subscribe(res => {
      switch (res.key) {
        case 'add_address_suffix_success':
          this.onCancel();
          break;
        case 'edit_address_suffix_success':
          this.onCancel();
          break;
      }
    })
  }

  handleOpenModal(s: string, data?: AddressSuffix) {
    this.modalKey = s;
    this.visible = true;
    if (data) {
      this.checkData = data;
    }
  }

  onCancel() {
    this.visible = false;
    const timer = setTimeout(() => {
      this.modalKey = '';
      clearTimeout(timer);
    }, 100);
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.sub && this.sub.unsubscribe();
  }
}
