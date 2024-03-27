import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'time',
})
export class TimePipe implements PipeTransform {
  transform(value: string): string {
    if (!value) {
      return '';
    }
    const [hours, minutes] = value.split(':');
    const hourValue = parseInt(hours, 10);
    const period = hourValue >= 12 ? 'PM' : 'AM';
    const hour = hourValue % 12 || 12;

    return `${hour}:${minutes} ${period}`;
  }
}
