import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ActividadesFabricaPage } from './actividades-fabrica.page';

const routes: Routes = [
  {
    path: '',
    component: ActividadesFabricaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ActividadesFabricaPageRoutingModule {}
