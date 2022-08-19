import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ActividadesFabricaPageRoutingModule } from './actividades-fabrica-routing.module';

import { ActividadesFabricaPage } from './actividades-fabrica.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ActividadesFabricaPageRoutingModule
  ],
  declarations: [ActividadesFabricaPage]
})
export class ActividadesFabricaPageModule {}
