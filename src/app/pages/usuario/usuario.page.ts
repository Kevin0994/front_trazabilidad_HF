import { Component, OnInit } from '@angular/core';

import { AlertController, NavController, ModalController } from '@ionic/angular';
import { ProviderService } from '../../../provider/ApiRest/provider.service'
import { ModalUsuarioPage } from '../../modals/modal-usuario/modal-usuario.page'

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.page.html',
  styleUrls: ['./usuario.page.scss'],
})
export class UsuarioPage implements OnInit {

  usuarios:any=[];
  usuario:any;

  constructor(public proveedor: ProviderService,
    public alertController: AlertController,
    public navCtrl:NavController,
    public modalController:ModalController,
    ) { 


    }

  ngOnInit() {
  }

  ionViewWillEnter(){
    this.proveedor.loadUsuarios().then(data => {
      this.usuarios=data;
    }).catch(data => {
      console.log(data);
    })
  }

  async openModal(){
    const modal = await this.modalController.create({
      component: ModalUsuarioPage,
      cssClass: 'modalUsuario',
      componentProps:{
        'type':'Nuevo Registro',
      }
    });

    modal.onDidDismiss().then(data => {
      this.ionViewWillEnter();
    })

    return await modal.present();
  }

  async EditUsuario(id:any){
    this.proveedor.BuscarUsuario(id).then(data => {
      this.usuario= data;
      this.ModelPresent(id);
    }).catch(data => {
      console.log(data);
    })
  }

  async ModelPresent(id:any){
    const modal = await this.modalController.create({
      component: ModalUsuarioPage,
      cssClass: 'modalCosecha',
      componentProps:{
        'Usuario':this.usuario,
        'type':'Editar Registro',
        'id' : id
      }
    });

    modal.onDidDismiss().then(data => {
      this.ionViewWillEnter();
    })

    return await modal.present();
  }

  async DeleteUsuario(id:any){
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
            this.proveedor.EliminarUsuario(id).subscribe(data => {
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
