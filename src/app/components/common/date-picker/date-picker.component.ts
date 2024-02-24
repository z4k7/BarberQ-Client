import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatCardModule} from '@angular/material/card';
import {MatNativeDateModule, NativeDateAdapter} from '@angular/material/core';

@Component({
  selector: 'app-date-picker',
  standalone: true,
  providers: [{ provide: NativeDateAdapter, useClass: NativeDateAdapter }],
  imports: [CommonModule,MatCardModule, MatDatepickerModule, MatNativeDateModule],
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.css']
})
export class DatePickerComponent {
  selected: Date | null = null;
}
