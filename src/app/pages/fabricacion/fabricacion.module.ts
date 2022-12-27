import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FabricacionPageRoutingModule } from './fabricacion-routing.module';

import { FabricacionPage } from './fabricacion.page';
import { IconsModule } from 'src/app/icons/icons.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    IconsModule,
    FabricacionPageRoutingModule
  ],
  declarations: [FabricacionPage,]
})
export class FabricacionPageModule {}
