import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatusDirective } from '../directives/status.directive';
import { CapitalizePipe } from '../pipes/capitalize.pipe';
import { TimePipe } from '../pipes/time.pipe';

@NgModule({
  declarations: [StatusDirective, CapitalizePipe, TimePipe],
  imports: [CommonModule],
  exports: [StatusDirective, CapitalizePipe, TimePipe],
})
export class SharedModule {}
