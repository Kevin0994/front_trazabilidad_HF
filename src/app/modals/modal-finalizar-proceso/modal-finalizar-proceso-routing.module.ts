import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModalFinalizarProcesoPage } from './modal-finalizar-proceso.page';

const routes: Routes = [
  {
    path: '',
    component: ModalFinalizarProcesoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModalFinalizarProcesoPageRoutingModule {}
