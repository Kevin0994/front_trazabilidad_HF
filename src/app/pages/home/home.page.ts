import { Component, OnInit } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';
import { ProviderService } from '../../../provider/ApiRest/provider.service'
import { MenuController } from '@ionic/angular';

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
  
  ){
    this.menu.enable(true);
    this.ValidarRol();    
  }

  ngOnInit() {
    
    this.ionViewDidLoad();
  }

  ionViewDidLoad(){
    this.proveedor.loadCosecha().then(data => {
      this.cosechas=data;
      console.log(this.cosechas)
    }).catch(data => {
      console.log(data);
    })
  }

  ValidarRol(){
    this.proveedor.BuscarRolUsuario(localStorage.getItem('UserId')).then(data => {
      console.log(data);
      if(data != true){
        document.getElementById("admin").style.display = "none";
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
            localStorage.clear();
            this.navCtrl.navigateRoot('login');
          }
        }
      ]
    });

    await alert.present();
  }

}
