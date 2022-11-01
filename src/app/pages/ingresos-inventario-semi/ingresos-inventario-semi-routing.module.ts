import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { IngresosInventarioSemiPage } from './ingresos-inventario-semi.page';

const routes: Routes = [
  {
    path: '',
    component: IngresosInventarioSemiPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class IngresosInventarioSemiPageRoutingModule {}
