import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FabricacionPageRoutingModule } from './fabricacion-routing.module';

import { FabricacionPage } from './fabricacion.page';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FabricacionPageRoutingModule
  ],
  declarations: [FabricacionPage,]
})
export class FabricacionPageModule {}
