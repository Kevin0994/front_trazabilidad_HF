import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModalCategoriaProductoPageRoutingModule } from './modal-categoria-producto-routing.module';

import { ModalCategoriaProductoPage } from './modal-categoria-producto.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    ModalCategoriaProductoPageRoutingModule
  ],
  declarations: [ModalCategoriaProductoPage]
})
export class ModalCategoriaProductoPageModule {}
