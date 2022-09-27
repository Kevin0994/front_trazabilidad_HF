import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModalProductoSemifinalPageRoutingModule } from './modal-producto-semifinal-routing.module';

import { ModalProductoSemifinalPage } from './modal-producto-semifinal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    ModalProductoSemifinalPageRoutingModule
  ],
  declarations: [ModalProductoSemifinalPage]
})
export class ModalProductoSemifinalPageModule {}
