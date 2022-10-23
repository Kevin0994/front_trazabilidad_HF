import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController, NavController } from '@ionic/angular';
import { ProviderService } from 'src/provider/ApiRest/provider.service';
import { ModalFinalizarProcesoPage } from '../../modals/modal-finalizar-proceso/modal-finalizar-proceso.page'
@Component({
  selector: 'app-procesos',
  templateUrl: './procesos.page.html',
  styleUrls: ['./procesos.page.scss'],
})
export class ProcesosPage implements OnInit {

  public productos:any;

  constructor(private proveedor: ProviderService,
    private alertController: AlertController,
    private navCtrl:NavController,
    private modalController:ModalController) { }

  ngOnInit() {

  }

  ionViewWillEnter(){
    this.proveedor.obtenerDocumentos('inventarioProductoSemifinal/proceso/documents').then(data => {
      this.productos=data;
      console.table(this.productos);
    }).catch(data => {
      console.log(data);
    })
  }

  async openModal(id:string,peso:any){
    const modal = await this.modalController.create({
      component: ModalFinalizarProcesoPage,
      cssClass: 'modalCosecha',
      componentProps:{
        'idProceso': id,
        'pesoMp':peso
      }
    });

    return await modal.present();
  }

  async MensajeServidor(){
    const alert = await this.alertController.create({
      header: 'Exito',
      message: 'El proceso se ha completado con exito',
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
