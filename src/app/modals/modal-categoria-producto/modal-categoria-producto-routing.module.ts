import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModalCategoriaProductoPage } from './modal-categoria-producto.page';

const routes: Routes = [
  {
    path: '',
    component: ModalCategoriaProductoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModalCategoriaProductoPageRoutingModule {}
