import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { IngresosInventarioSemiPageRoutingModule } from './ingresos-inventario-semi-routing.module';

import { IngresosInventarioSemiPage } from './ingresos-inventario-semi.page';

import { NgxDatatableModule } from '@swimlane/ngx-datatable';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    IngresosInventarioSemiPageRoutingModule,
    NgxDatatableModule,
  ],
  declarations: [IngresosInventarioSemiPage]
})
export class IngresosInventarioSemiPageModule {}
