import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModalCosechaPageRoutingModule } from './modal-cosecha-routing.module';

import { ModalCosechaPage } from './modal-cosecha.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    ModalCosechaPageRoutingModule
  ],
  declarations: [ModalCosechaPage]
})
export class ModalCosechaPageModule {}
