import { Component, OnInit } from '@angular/core';

import { AlertController, NavController, ModalController } from '@ionic/angular';
import { ProviderService } from '../../../provider/ApiRest/provider.service'
import { ModalCosechaPage } from '../../modals/modal-cosecha/modal-cosecha.page'

@Component({
  selector: 'app-cosecha',
  templateUrl: './cosecha.page.html',
  styleUrls: ['./cosecha.page.scss'],
})
export class CosechaPage implements OnInit {

  private cosechas:any=[];
  private cosecha:any;

  constructor(public proveedor: ProviderService,
    public alertController: AlertController,
    public navCtrl:NavController,
    public modalController:ModalController,) {
      
    }

  ngOnInit() {

  }

  ionViewWillEnter(){
    this.proveedor.loadCosechas().then(data => {
      this.cosechas=data;
    }).catch(data => {
      console.log(data);
    })
  }

  async openModal(){
    const modal = await this.modalController.create({
      component: ModalCosechaPage,
      cssClass: 'modalCosecha',
      componentProps:{
        'type':'Nuevo Registro',
        'accion': false,
      }
    });

    modal.onDidDismiss().then(data => {
      this.ionViewWillEnter();
    })

    return await modal.present();
  }

  async MensajeServidor(){
    const alert = await this.alertController.create({
      header: 'Eliminar',
      message: 'La eliminacion se completo con exito',
      buttons: ['OK']
    });

    await alert.present();
  }

  async ErrorMensajeServidor(){
    const alert = await this.alertController.create({
      header: 'Error del servidor',
      message: 'error al conectarse con el servidor',
      buttons: ['OK']
    });

    await alert.present();
  }

}

