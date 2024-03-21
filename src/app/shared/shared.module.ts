import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatusDirective } from '../directives/status.directive';
import { CapitalizePipe } from '../pipes/capitalize.pipe';

@NgModule({
  declarations: [StatusDirective, CapitalizePipe],
  imports: [CommonModule],
  exports: [StatusDirective, CapitalizePipe],
})
export class SharedModule {}
