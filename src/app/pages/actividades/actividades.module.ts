import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ActividadesPageRoutingModule } from './actividades-routing.module';

import { ActividadesPage } from './actividades.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ActividadesPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [ActividadesPage]
})
export class ActividadesPageModule {}
