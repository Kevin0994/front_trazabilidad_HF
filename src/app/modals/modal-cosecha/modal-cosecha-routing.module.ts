import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModalCosechaPage } from './modal-cosecha.page';

const routes: Routes = [
  {
    path: '',
    component: ModalCosechaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModalCosechaPageRoutingModule {}
