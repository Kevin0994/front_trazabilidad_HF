import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CategoriaProductosPageRoutingModule } from './categoria-productos-routing.module';

import { CategoriaProductosPage } from './categoria-productos.page';
import { IconsModule } from 'src/app/icons/icons.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    IconsModule,
    CategoriaProductosPageRoutingModule
  ],
  declarations: [CategoriaProductosPage]
})
export class CategoriaProductosPageModule {}
