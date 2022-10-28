import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModalLeerNFCPageRoutingModule } from './modal-leer-nfc-routing.module';

import { ModalLeerNFCPage } from './modal-leer-nfc.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModalLeerNFCPageRoutingModule
  ],
  declarations: [ModalLeerNFCPage]
})
export class ModalLeerNFCPageModule {}
