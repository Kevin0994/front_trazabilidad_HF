import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModalDescontarStockPageRoutingModule } from './modal-descontar-stock-routing.module';

import { ModalDescontarStockPage } from './modal-descontar-stock.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    ModalDescontarStockPageRoutingModule
  ],
  declarations: [ModalDescontarStockPage]
})
export class ModalDescontarStockPageModule {}
