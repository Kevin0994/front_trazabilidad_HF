import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { IngresadoGuard } from './ingresado.guard';
import { NoIngresadoGuard } from './no-ingresado.guard';

const routes: Routes = [
  
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then( m => m.HomePageModule),
    canActivate: [IngresadoGuard]
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule),
    canActivate: [NoIngresadoGuard]
  },
  {
    path: 'cosecha',
    loadChildren: () => import('./pages/cosecha/cosecha.module').then( m => m.CosechaPageModule),
    canActivate: [IngresadoGuard]
  },
  {
    path: 'actividades',
    loadChildren: () => import('./pages/actividades/actividades.module').then( m => m.ActividadesPageModule),
    canActivate: [IngresadoGuard]
  },
  {
    path: 'modal-cosecha',
    loadChildren: () => import('./modals/modal-cosecha/modal-cosecha.module').then( m => m.ModalCosechaPageModule),
    canActivate: [IngresadoGuard]
  },
  {
    path: 'usuario',
    loadChildren: () => import('./pages/usuario/usuario.module').then( m => m.UsuarioPageModule),
    canActivate: [IngresadoGuard]
  },
  {
    path: 'modal-usuario',
    loadChildren: () => import('./modals/modal-usuario/modal-usuario.module').then( m => m.ModalUsuarioPageModule),
    canActivate: [IngresadoGuard]
  },
  {
    path: 'cosecha-historial',
    loadChildren: () => import('./pages/cosecha-historial/cosecha-historial.module').then( m => m.CosechaHistorialPageModule),
    canActivate: [IngresadoGuard]
  },





];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
