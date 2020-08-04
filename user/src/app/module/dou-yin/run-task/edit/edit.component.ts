import { ScriptsItem, Comments } from 'src/app/services/dy/dy-play.service';
import { RunTaskItem, EditRunTaskParams } from 'src/app/services/dy/dy-run-task.service';
import { Component, OnInit, Input } from '@angular/core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { ByValueService } from 'src/app/services/by-value.service';
import { differenceInCalendarDays } from "date-fns";
import { format } from "date-fns";


@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.less']
})
export class EditComponent implements OnInit {
  @Input() isCopy = false;
  @Input() data: RunTaskItem;
  formGroup: FormGroup;
  @Input() playAll: ScriptsItem[];
  @Input() playDetails: Comments;
  visible = false
  constructor(private fb: FormBuilder, private byVal: ByValueService) { }

  ngOnInit() {
    this.formGroup = this.fb.group({
      id: [this.data.id, [Validators.required]],
      name: [this.data.name, [Validators.required]],
      anchorId: [this.data.anchorId, [Validators.required]],
      scriptId: [this.data.script.id, [Validators.required]],
      scriptStartTime: [this.data.scriptStartTime * 1000, [Validators.required]],
      deviceEnterTime: [this.data.deviceEnterTime * 1000, [Validators.required]],
      endTime: [{ value: this.data.deviceEnterTime * 1000 + this.data.script.totalTime, disabled: true }]
    })
  }
  disabledDate = (current: Date): boolean => {
    return differenceInCalendarDays(current, this.formGroup.get('scriptStartTime').value) < 0;
  }

  predictDate = (current: Date): boolean => {
    return differenceInCalendarDays(current, new Date()) < 0;
  }

  get enterTimeDis() {
    if (this.formGroup) {
      const startTime = this.formGroup.get('scriptStartTime').value;
      return !startTime;
    }
    return true;
  }

  submitForm() {
    if (this.formGroup.valid) {
      const data: EditRunTaskParams = this.formGroup.value
      data.deviceEnterTime = format(data.deviceEnterTime as Date, 'yyyy-MM-dd HH:mm:ss')
      data.scriptStartTime = format(data.scriptStartTime as Date, 'yyyy-MM-dd HH:mm:ss')
      if (this.isCopy) {
        delete data.id;
        this.byVal.sendMeg({ key: 'add_start', data })
      } else {
        this.byVal.sendMeg({ key: 'edit_start', data })
      }
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
  getEndTime() {
    if (this.formGroup && this.playAll) {
      const v = this.formGroup.get('scriptStartTime').value;
      this.formGroup.patchValue({
        endTime: v * 1000 + this.playAll.find(({ id }) => id === this.formGroup.get('scriptId').value).totalTime
      })
    }
  }
  get playItem() {
    if (this.formGroup && this.playAll) return this.playAll.find(({ id }) => id === this.formGroup.get('scriptId').value);
    return;
  }
  get outline() {
    if (this.formGroup && this.playAll) {
      const v = this.formGroup.get('scriptId').value;
      const i = this.playAll.find(({ id }) => id === v);
      return i;
    }
    return;
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
}
