import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

import { IonicModule } from '@ionic/angular';

import { InventarioPageRoutingModule } from './inventario-routing.module';

import { InventarioPage } from './inventario.page';
import { IconsModule } from 'src/app/icons/icons.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    IconsModule,
    InventarioPageRoutingModule,
    NgxDatatableModule,
  ],
  declarations: [InventarioPage]
})
export class InventarioPageModule {}
