import { Component, OnInit, Input } from '@angular/core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { ByValueService } from 'src/app/services/by-value.service';
import { differenceInCalendarDays } from "date-fns";
import { ScriptsItem, Comments } from 'src/app/services/dy/dy-play.service';
import { format } from "date-fns";

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.less']
})
export class AddComponent implements OnInit {
  formGroup: FormGroup;
  @Input() playAll: ScriptsItem[];
  @Input() playDetails: Comments;
  visible = false;
  get playItem() {
    if (this.formGroup && this.playAll) return this.playAll.find(({ id }) => id === this.formGroup.get('scriptId').value);
    return;
  }
  constructor(private fb: FormBuilder,  private byVal: ByValueService) { }

  ngOnInit() {
    this.formGroup = this.fb.group({
      name: [null, [Validators.required]],
      anchorId: [null, [Validators.required]],
      scriptId: [null, [Validators.required]],
      scriptStartTime: [null, [Validators.required]],
      deviceEnterTime: [null, [Validators.required]],
      endTime: [{ value: null, disabled: true }]
    })
  }
  disabledDate = (current: Date): boolean => {
    if (this.formGroup) {
      return differenceInCalendarDays(current, this.formGroup.get('scriptStartTime').value) < 0;
    }
  }

  predictDate = (current: Date): boolean => {
    return differenceInCalendarDays(current, new Date()) < 0;
  }

  get outline() {
    if (this.formGroup && this.playAll) {
      const v = this.formGroup.get('scriptId').value;
      const i = this.playAll.find(({ id }) => id === v);
      return i;
    }
    return;
  }

  get enterTimeDis() {
    if (this.formGroup) {
      const startTime = this.formGroup.get('scriptStartTime').value;
      return !startTime;
    }
    return true;
  }

  get scriptStartDis() {
    if (this.formGroup)
      return !this.formGroup.get('scriptId').value;
    return true
  }

  predictChange(e) {
    if (e) {
      if (this.formGroup && this.playAll) {
        const v = new Date(this.formGroup.get('scriptStartTime').value).getTime();
        let deviceTime = this.outline.characterNumber * 20000;
        deviceTime = deviceTime > 600000 ? 600000 : deviceTime;
        this.formGroup.patchValue({
          endTime: v + this.playAll.find(({ id }) => id === this.formGroup.get('scriptId').value).totalTime,
          deviceEnterTime: v - deviceTime
        })
      }
    }
  }


  submitForm() {
    console.log(this.formGroup.value);
    if (this.formGroup.valid) {
      const data = this.formGroup.value;
      data.deviceEnterTime = format(data.deviceEnterTime, 'yyyy-MM-dd HH:mm:ss')
      data.scriptStartTime = format(data.scriptStartTime, 'yyyy-MM-dd HH:mm:ss')
      this.byVal.sendMeg({ key: 'add_start', data })
    } else {
      for (const i in this.formGroup.controls) {
        this.formGroup.controls[i].markAsDirty();
        this.formGroup.controls[i].updateValueAndValidity();
      }
    }
  }

  // 查看剧本详情
  handleDetail() {
    this.visible = true;
    this.byVal.sendMeg({ key: 'open_detail', data: this.formGroup.get('scriptId').value })
  }
  onCancel() {
    this.visible = false;
  }
}
