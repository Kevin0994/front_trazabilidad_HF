import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { ProviderService } from '../provider/ApiRest/provider.service';
import { ProviderMetodosCrud } from '../provider/methods/providerMetodosCrud.service';
import { ProviderMensajes } from '../provider/modalMensaje/providerMessege.service';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { NFC, Ndef } from '@awesome-cordova-plugins/nfc/ngx';
import { InterceptorService } from './interceptors/interceptor.service';
import { IconsModule } from './icons/icons.module';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgxDatatableModule,
    IconsModule
  ],
  providers: [
    { 
      provide: RouteReuseStrategy, 
      useClass: IonicRouteStrategy 
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: InterceptorService,
      multi: true
    },
    ProviderService,
    ProviderMetodosCrud,
    ProviderMensajes,
    CookieService,
    AndroidPermissions,
    NFC,
    Ndef,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
