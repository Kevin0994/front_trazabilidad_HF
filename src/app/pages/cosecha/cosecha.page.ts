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

  cosechas:any=[];
  cosecha:any;

  constructor(public proveedor: ProviderService,
    public alertController: AlertController,
    public navCtrl:NavController,
    public modalController:ModalController,) {
      
    }

  ngOnInit() {

  }

  ionViewWillEnter(){
    this.proveedor.loadCosecha().then(data => {
      this.cosechas=data;
      console.log(this.cosechas)
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
      }
    });
    return await modal.present();
  }

  
  async EditCosecha(id:any){
    this.proveedor.BuscarCosecha(id).then(data => {
      this.cosecha= data;
      this.ModelPresent(id);
    }).catch(data => {
      console.log(data);
    })
  }

  async DeleteCosecha(id:any){
    const alert = await this.alertController.create({
      header: 'Eliminar',
      message: '¿Seguro que desea elimar?',
      buttons: [
        {
          text: 'No',
          handler: () => {
          }
        }, {
          text: 'Si',
          handler: () => {
            this.proveedor.EliminarCosecha(id).subscribe(data => {
              console.log(data);
              this.ionViewWillEnter();
              if(this.proveedor.status){
                this.ErrorMensajeServidor();
              }else{
                this.MensajeServidor();
              }
            })
          }
        }
      ]
    });

    await alert.present();
  }


  async ModelPresent(id:any){
    const modal = await this.modalController.create({
      component: ModalCosechaPage,
      cssClass: 'modalCosecha',
      componentProps:{
        'Cosecha':this.cosecha,
        'type':'Editar Registro',
        'id' : id
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

