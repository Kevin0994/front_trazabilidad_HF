import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController, NavController } from '@ionic/angular';
import { ProviderService } from 'src/provider/ApiRest/provider.service';
import { ModalAlimentosPage } from '../../modals/modal-alimentos/modal-alimentos.page'

@Component({
  selector: 'app-alimentos',
  templateUrl: './alimentos.page.html',
  styleUrls: ['./alimentos.page.scss'],
})
export class AlimentosPage implements OnInit {

  alimentos:any=[];
  alimento:any;

  constructor(public proveedor: ProviderService,
    public alertController: AlertController,
    public navCtrl:NavController,
    public modalController:ModalController,) { }

  ngOnInit() {
  } 

  ionViewWillEnter(){
    this.loadDatos();
  }

  loadDatos(){
    this.proveedor.obtenerDocumentos('alimentos/documents').then(data => {
      this.alimentos=data;
    }).catch(data => {
      console.log(data);
    })
  }

  async openModal(){
    const modal = await this.modalController.create({
      component: ModalAlimentosPage,
      cssClass: 'modalAlimento',
      componentProps:{
        'type':'Nuevo Registro',
      }
    });

    modal.onDidDismiss().then(data => {
      this.ionViewWillEnter();
    })

    return await modal.present();
  }
  
  async EditAlimento(alimento:any){
    this.alimento= alimento;
    this.ModelPresentEdit();
  }

  async ModelPresentEdit(){
    const modal = await this.modalController.create({
      component: ModalAlimentosPage,
      cssClass: 'modalCosecha',
      componentProps:{
        'Alimento':this.alimento,
        'type':'Editar Registro',
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
