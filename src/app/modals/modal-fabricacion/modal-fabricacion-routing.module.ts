import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModalFabricacionPage } from './modal-fabricacion.page';

const routes: Routes = [
  {
    path: '',
    component: ModalFabricacionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModalFabricacionPageRoutingModule {}
