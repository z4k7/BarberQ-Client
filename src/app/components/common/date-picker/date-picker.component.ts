import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MatDatepicker,
  MatDatepickerModule,
} from '@angular/material/datepicker';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule, NativeDateAdapter } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-date-picker',
  standalone: true,
  providers: [{ provide: NativeDateAdapter, useClass: NativeDateAdapter }],
  imports: [
    CommonModule,
    MatCardModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.css'],
})
export class DatePickerComponent {
  selected: Date = new Date();
  minDate: Date = new Date();

  @Output() dateSelected = new EventEmitter<string>();

  onDateChange(event: Date) {
    this.selected = event;
    const day = this.selected.getDate().toString().padStart(2, '0');
    const month = (this.selected.getMonth() + 1).toString().padStart(2, '0');
    const year = this.selected.getFullYear();
    const selectedDate = `${day}-${month}-${year}`;
    this.dateSelected.emit(selectedDate);
  }
}
