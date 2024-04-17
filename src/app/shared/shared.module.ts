import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatusDirective } from '../directives/status.directive';
import { CapitalizePipe } from '../pipes/capitalize.pipe';
import { TimePipe } from '../pipes/time.pipe';
import { RevenuePipe } from '../pipes/revenue.pipe';

@NgModule({
  declarations: [StatusDirective, CapitalizePipe, TimePipe, RevenuePipe],
  imports: [CommonModule],
  exports: [StatusDirective, CapitalizePipe, TimePipe, RevenuePipe],
})
export class SharedModule {}
