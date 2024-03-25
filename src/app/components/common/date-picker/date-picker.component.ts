import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule, NativeDateAdapter } from '@angular/material/core';

@Component({
  selector: 'app-date-picker',
  standalone: true,
  providers: [{ provide: NativeDateAdapter, useClass: NativeDateAdapter }],
  imports: [
    CommonModule,
    MatCardModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.css'],
})
export class DatePickerComponent {
  selected: Date = new Date();

  @Output() dateSelected = new EventEmitter<string>();

  onDateChange(event: any) {
    this.selected = event;
    console.log(`Selected date object`, this.selected);

    const day = this.selected.getDate().toString().padStart(2, '0');
    const month = (this.selected.getMonth() + 1).toString().padStart(2, '0');
    const year = this.selected.getFullYear();
    const selectedDate = `${day}-${month}-${year}`;

    console.log(`Emitted date string`, selectedDate);

    this.dateSelected.emit(selectedDate);
  }
}
