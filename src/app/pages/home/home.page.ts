import { Component, OnInit } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';
import { ProviderService } from '../../../provider/ApiRest/provider.service'
import { MenuController } from '@ionic/angular';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit{

  cosechas:any;

  constructor(public proveedor: ProviderService,
    public alertController: AlertController,
    public navCtrl:NavController,
    private menu: MenuController,
    private cookieService: CookieService
  ){
    this.menu.enable(true);   
  }

  ngOnInit() {
    this.menu.enable(true);
    this.ValidarRol();
  }

  ngAfterViewInit(){

  }

  ValidarRol(){
    this.proveedor.obtenerDocumentosPorId('usuario/documents/rol/',this.cookieService.get('idUsuario')).then(data => {
      console.log(data);

      if(data != "Administrador"){

        if(data == 'Empleado Bodega'){
          console.log("data");
          document.getElementById('bodega').style.display = "block";
          document.getElementById('fabrica').style.display = "none";
          document.getElementById('admin').style.display = "none";
          document.getElementById('labelAdmin').style.display = "none";
        }else{

          document.getElementById('bodega').style.display = "none";
          document.getElementById('fabrica').style.display = "block";
          document.getElementById('admin').style.display = "none";
          document.getElementById('labelAdmin').style.display = "none";
        }

      }else{
        document.getElementById('bodega').style.display = "block";
        document.getElementById('fabrica').style.display = "block";
        document.getElementById('admin').style.display = "block";
        document.getElementById('labelAdmin').style.display = "block";
      }
    }).catch(data => {
      console.log(data);
    })
  }

  async logout(){

    const alert = await this.alertController.create({
      header: 'Salir',
      message: '¿Seguro desea salir?',
      buttons: [
        {
          text: 'No',
          handler: () => {

          }
        }, {
          text: 'Si',
          handler: () => {
            this.cookieService.delete('idUsuario');
            localStorage.clear();
            this.cookieService.deleteAll();
            this.navCtrl.navigateRoot('login');
          }
        }
      ]
    });

    await alert.present();
  }

}
