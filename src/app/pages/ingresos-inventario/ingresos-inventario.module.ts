import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { IngresosInventarioRoutingModule } from './ingresos-inventario-routing.module';

import { IngresosInventario } from './ingresos-inventario.page';

import { NgxDatatableModule } from '@swimlane/ngx-datatable';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    IngresosInventarioRoutingModule,
    NgxDatatableModule,
  ],
  declarations: [IngresosInventario]
})
export class IngresosInventarioSemiPageModule {}
