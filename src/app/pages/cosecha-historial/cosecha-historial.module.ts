import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CosechaHistorialPageRoutingModule } from './cosecha-historial-routing.module';

import { CosechaHistorialPage } from './cosecha-historial.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CosechaHistorialPageRoutingModule
  ],
  declarations: [CosechaHistorialPage]
})
export class CosechaHistorialPageModule {}
