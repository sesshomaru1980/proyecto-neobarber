import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BarbersListComponent } from './barbers-list/barbers-list.component';

const routes: Routes = [{ path: '', component: BarbersListComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BarbersRoutingModule {}
