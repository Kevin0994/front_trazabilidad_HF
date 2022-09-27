import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModalProductoSemifinalPage } from './modal-producto-semifinal.page';

const routes: Routes = [
  {
    path: '',
    component: ModalProductoSemifinalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModalProductoSemifinalPageRoutingModule {}
