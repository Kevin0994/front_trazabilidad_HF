import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModalFabricacionPageRoutingModule } from './modal-fabricacion-routing.module';

import { ModalFabricacionPage } from './modal-fabricacion.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    ModalFabricacionPageRoutingModule
  ],
  declarations: [ModalFabricacionPage]
})
export class ModalFabricacionPageModule {}
