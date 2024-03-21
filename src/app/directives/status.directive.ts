import {
  Directive,
  ElementRef,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';

@Directive({
  selector: '[appStatusDirective]',
})
export class StatusDirective implements OnChanges {
  @Input('appStatusDirective') status: string;

  constructor(private el: ElementRef) {
    this.status = '';
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['status']) {
      this.updateClass();
    }
  }

  private updateClass() {
    const classMap: { [key: string]: string } = {
      pending: 'h-2.5 w-2.5 rounded-full bg-yellow-500 me-2',
      approved: 'h-2.5 w-2.5 rounded-full bg-blue-500 me-2',
      rejected: 'h-2.5 w-2.5 rounded-full bg-red-500 me-2',
      disapproved: 'h-2.5 w-2.5 rounded-full bg-red-500 me-2',
      active: 'h-2.5 w-2.5 rounded-full bg-red-green me-2',
    };

    const newClass =
      classMap[this.status as keyof typeof classMap] ||
      'h-2.5 w-2.5 rounded-full bg-gray-500 me-2';
    this.el.nativeElement.className = newClass;
  }
}
