import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { IngresadoGuard } from './ingresado.guard';
import { NoIngresadoGuard } from './no-ingresado.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'home',
    loadChildren: () =>
      import('./pages/home/home.module').then((m) => m.HomePageModule),
    canActivate: [IngresadoGuard],
  },
  {
    path: 'login',
    loadChildren: () =>
      import('./pages/login/login.module').then((m) => m.LoginPageModule),
    canActivate: [NoIngresadoGuard],
  },
  {
    path: 'cosecha',
    loadChildren: () =>
      import('./pages/cosecha/cosecha.module').then((m) => m.CosechaPageModule),
    canActivate: [IngresadoGuard],
  },
  {
    path: 'actividades',
    loadChildren: () =>
      import('./pages/actividades/actividades.module').then(
        (m) => m.ActividadesPageModule
      ),
    canActivate: [IngresadoGuard],
  },
  {
    path: 'modal-cosecha',
    loadChildren: () =>
      import('./modals/modal-cosecha/modal-cosecha.module').then(
        (m) => m.ModalCosechaPageModule
      ),
    canActivate: [IngresadoGuard],
  },
  {
    path: 'usuario',
    loadChildren: () =>
      import('./pages/usuario/usuario.module').then((m) => m.UsuarioPageModule),
    canActivate: [IngresadoGuard],
  },
  {
    path: 'modal-usuario',
    loadChildren: () =>
      import('./modals/modal-usuario/modal-usuario.module').then(
        (m) => m.ModalUsuarioPageModule
      ),
    canActivate: [IngresadoGuard],
  },
  {
    path: 'cosecha-historial',
    loadChildren: () =>
      import('./pages/cosecha-historial/cosecha-historial.module').then(
        (m) => m.CosechaHistorialPageModule
      ),
    canActivate: [IngresadoGuard],
  },
  {
    path: 'fabricacion',
    loadChildren: () =>
      import('./pages/fabricacion/fabricacion.module').then(
        (m) => m.FabricacionPageModule
      ),
  },
  {
    path: 'procesos',
    loadChildren: () =>
      import('./pages/procesos/procesos.module').then(
        (m) => m.ProcesosPageModule
      ),
  },
  {
    path: 'actividades-fabrica',
    loadChildren: () =>
      import('./pages/actividades-fabrica/actividades-fabrica.module').then(
        (m) => m.ActividadesFabricaPageModule
      ),
  },
  {
    path: 'inventario',
    loadChildren: () =>
      import('./pages/inventario/inventario.module').then(
        (m) => m.InventarioPageModule
      ),
  },
  {
    path: 'modal-fabricacion',
    loadChildren: () =>
      import('./modals/modal-fabricacion/modal-fabricacion.module').then(
        (m) => m.ModalFabricacionPageModule
      ),
  },
  {
    path: 'modal-finalizar-proceso',
    loadChildren: () =>
      import(
        './modals/modal-finalizar-proceso/modal-finalizar-proceso.module'
      ).then((m) => m.ModalFinalizarProcesoPageModule),
  },
  {
    path: 'categoria-productos',
    loadChildren: () =>
      import('./pages/categoria-productos/categoria-productos.module').then(
        (m) => m.CategoriaProductosPageModule
      ),
  },
  {
    path: 'productos',
    loadChildren: () =>
      import('./pages/productos/productos.module').then(
        (m) => m.ProductosPageModule
      ),
  },
  {
    path: 'modal-categoria-producto',
    loadChildren: () =>
      import(
        './modals/modal-categoria-producto/modal-categoria-producto.module'
      ).then((m) => m.ModalCategoriaProductoPageModule),
  },
  {
    path: 'alimentos',
    loadChildren: () =>
      import('./pages/alimentos/alimentos.module').then(
        (m) => m.AlimentosPageModule
      ),
  },
  {
    path: 'modal-alimentos',
    loadChildren: () =>
      import('./modals/modal-alimentos/modal-alimentos.module').then(
        (m) => m.ModalAlimentosPageModule
      ),
  },
  {
    path: 'modal-producto-semifinal',
    loadChildren: () =>
      import('./modals/modal-producto/modal-producto.module').then(
        (m) => m.ModalProductoSemifinalPageModule
      ),
  },
  {
    path: 'modal-leer-nfc',
    loadChildren: () =>
      import('./modals/modal-leer-nfc/modal-leer-nfc.module').then(
        (m) => m.ModalLeerNFCPageModule
      ),
  },
  {
    path: 'ingresos-inventario',
    loadChildren: () =>
      import(
        './pages/ingresos-inventario/ingresos-inventario.module'
      ).then((m) => m.IngresosInventarioSemiPageModule),
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
