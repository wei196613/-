import { Directive, ElementRef, Renderer2, Output, EventEmitter } from '@angular/core';

@Directive({
  selector: '[appClickStop]'
})
export class ClickStopDirective {

  constructor(
    private element: ElementRef,
    private renderer: Renderer2
  ) { }
  @Output("appClickStop")
  stopPropEvent = new EventEmitter();

  // Function和箭头函数均一样
  unsubscribe: () => void;

  ngOnInit() {
    this.unsubscribe = this.renderer.listen(
      this.element.nativeElement, 'click', (event) => {
        // 阻止事件冒泡，event是DOM对象
        event.stopPropagation();
        // 阻止之后要将对象再发射出去
        this.stopPropEvent.emit(event);
      });
  }

  ngOnDestroy() {
    this.unsubscribe();
  }

}