import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AppSpinService {
  info: string;
  isOpen = false;

  open(info: string = '') {
    this.info = info;
    this.isOpen = true;
  }

  close() {
    this.isOpen = false;
    this.info = '';
  }
}
