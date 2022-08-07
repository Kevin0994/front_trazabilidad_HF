import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FabricacionPage } from './fabricacion.page';

const routes: Routes = [
  {
    path: '',
    component: FabricacionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FabricacionPageRoutingModule {}
