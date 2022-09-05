import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModalFinalizarProcesoPageRoutingModule } from './modal-finalizar-proceso-routing.module';

import { ModalFinalizarProcesoPage } from './modal-finalizar-proceso.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    ModalFinalizarProcesoPageRoutingModule
  ],
  declarations: [ModalFinalizarProcesoPage]
})
export class ModalFinalizarProcesoPageModule {}
