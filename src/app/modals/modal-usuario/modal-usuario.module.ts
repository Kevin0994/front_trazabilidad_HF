import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModalUsuarioPageRoutingModule } from './modal-usuario-routing.module';

import { ModalUsuarioPage } from './modal-usuario.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    ModalUsuarioPageRoutingModule
  ],
  declarations: [ModalUsuarioPage]
})
export class ModalUsuarioPageModule {}
