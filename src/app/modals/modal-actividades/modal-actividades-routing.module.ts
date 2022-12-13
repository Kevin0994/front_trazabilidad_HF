import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModalActividadesPage } from './modal-actividades.page';

const routes: Routes = [
  {
    path: '',
    component: ModalActividadesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModalActividadesPageRoutingModule {}
