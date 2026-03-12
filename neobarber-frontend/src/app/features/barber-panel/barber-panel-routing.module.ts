import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BarberAgendaComponent } from './barber-agenda/barber-agenda.component';
import { BarberBlockComponent } from './barber-block/barber-block.component';

const routes: Routes = [
  { path: '', redirectTo: 'agenda', pathMatch: 'full' },
  { path: 'agenda', component: BarberAgendaComponent },
  { path: 'block', component: BarberBlockComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BarberPanelRoutingModule {}
