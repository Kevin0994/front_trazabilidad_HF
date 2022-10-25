import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModalProductoSemifinalPageRoutingModule } from './modal-producto-routing.module';

import { ModalProductoPage } from './modal-producto.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    ModalProductoSemifinalPageRoutingModule
  ],
  declarations: [ModalProductoPage]
})
export class ModalProductoSemifinalPageModule {}
