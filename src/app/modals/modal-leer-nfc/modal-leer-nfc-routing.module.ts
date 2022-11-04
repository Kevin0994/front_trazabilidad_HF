import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModalLeerNFCPage } from './modal-leer-nfc.page';

const routes: Routes = [
  {
    path: '',
    component: ModalLeerNFCPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModalLeerNFCPageRoutingModule {}
