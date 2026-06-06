import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { BarberPanelRoutingModule } from './barber-panel-routing.module';
import { BarberAgendaComponent } from './barber-agenda/barber-agenda.component';
import { BarberBlockComponent } from './barber-block/barber-block.component';

@NgModule({
  declarations: [
    BarberAgendaComponent,
    BarberBlockComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    BarberPanelRoutingModule
  ]
})
export class BarberPanelModule {}