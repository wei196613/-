import { ByValueService } from 'src/app/services/by-value.service';
import { AddressLabelItem } from 'src/app/services/jd/address.service';
import { Component, OnInit, Input } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-address-label',
  templateUrl: './address-label.component.html',
  styleUrls: ['./address-label.component.less']
})
export class AddressLabelComponent implements OnInit {
  @Input() data: AddressLabelItem[];
  checkData: AddressLabelItem;
  visible = false;
  modalKey = '';
  sub: Subscription
  constructor(private byVal: ByValueService) { }

  ngOnInit() {
    this.sub = this.byVal.getMeg().subscribe(res => {
      switch (res.key) {
        case 'add_address_label_success':
          this.onCancel();
          break;
        case 'edit_address_label_success':
          this.onCancel();
          break;
      }
    })
  }
  handleOpenModal(s: string, data?: AddressLabelItem) {
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
   this.sub &&  this.sub.unsubscribe();
  }
}
