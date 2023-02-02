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
    this.loadData();
  }

  loadData(){
    this.proveedor.obtenerDocumentos('inventarioProductoSemifinal/proceso/documents').then(data => {
      this.OrdenarTabla(data);
      this.productos=data;
      console.table(this.productos);
    }).catch(data => {
      console.log(data);
    })
  }

  async openModal(proceso:any){
    const modal = await this.modalController.create({
      component: ModalFinalizarProcesoPage,
      cssClass: 'modalCosecha',
      componentProps:{
        'Proceso': proceso,
      }
    });
    modal.onDidDismiss().then(data => {
      this.loadData();
    })
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

  OrdenarTabla(ingresos:any=[]){
    ingresos.sort(function(a, b){ //Ordena el array de manera Descendente
      if(a.fechaEntrada > b.fechaEntrada){
          return 1
      } else if (a.fechaEntrada < b.fechaEntrada) {
          return -1
      } else {
          return 0
      }
   })
  }
}
