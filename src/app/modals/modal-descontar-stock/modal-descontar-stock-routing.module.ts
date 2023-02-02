import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModalDescontarStockPage } from './modal-descontar-stock.page';

const routes: Routes = [
  {
    path: '',
    component: ModalDescontarStockPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModalDescontarStockPageRoutingModule {}
