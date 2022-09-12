import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModalAlimentosPageRoutingModule } from './modal-alimentos-routing.module';

import { ModalAlimentosPage } from './modal-alimentos.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    ModalAlimentosPageRoutingModule
  ],
  declarations: [ModalAlimentosPage]
})
export class ModalAlimentosPageModule {}
