import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { BarbersRoutingModule } from './barbers-routing.module';
import { BarbersListComponent } from './barbers-list/barbers-list.component';

@NgModule({
  declarations: [BarbersListComponent],
  imports: [
    CommonModule,
    FormsModule,
    BarbersRoutingModule
  ]
})
export class BarbersModule {}