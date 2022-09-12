import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModalAlimentosPage } from './modal-alimentos.page';

const routes: Routes = [
  {
    path: '',
    component: ModalAlimentosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModalAlimentosPageRoutingModule {}
