import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModalActividadesPageRoutingModule } from './modal-actividades-routing.module';

import { ModalActividadesPage } from './modal-actividades.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    ModalActividadesPageRoutingModule
  ],
  declarations: [ModalActividadesPage]
})
export class ModalActividadesPageModule {}
