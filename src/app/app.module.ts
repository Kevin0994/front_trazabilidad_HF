import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { ProviderService } from '../provider/ApiRest/provider.service';
import { ProviderMetodosCrud } from '../provider/methods/providerMetodosCrud.service';
import { ProviderMensajes } from '../provider/modalMensaje/providerMessege.service';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { NFC, Ndef } from '@awesome-cordova-plugins/nfc/ngx';
import { InterceptorService } from './interceptors/interceptor.service';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgxDatatableModule,
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
    NFC,
    Ndef,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
