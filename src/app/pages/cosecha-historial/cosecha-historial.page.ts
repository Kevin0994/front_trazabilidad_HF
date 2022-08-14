import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController, NavController } from '@ionic/angular';
import { ModalCosechaPage } from 'src/app/modals/modal-cosecha/modal-cosecha.page';
import { ProviderService } from 'src/provider/ApiRest/provider.service';

@Component({
  selector: 'app-cosecha-historial',
  templateUrl: './cosecha-historial.page.html',
  styleUrls: ['./cosecha-historial.page.scss'],
})
export class CosechaHistorialPage implements OnInit {

  cosechaHistorial:any=[];
  historial:any;
  cosecha:any;

  constructor(public proveedor: ProviderService,
    public alertController: AlertController,
    public navCtrl:NavController,
    public modalController:ModalController,) {

    }

  ngOnInit() {

  }

  ionViewWillEnter(){
   this.loadDatos();
  }

  loadDatos(){
    this.proveedor.obtenerDocumentos('cosechasHistorial/documents').then(data => {
      this.cosechaHistorial=data;
    }).catch(data => {
      console.log(data);
    })
  }

   async EditCosecha(historial:any){
      this.historial= historial;
      this.ModelPresent();
   }

  async ValidarDelete(historial:any){
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

            var ingreso = historial.ingreso;
            var stock = historial.stock;
            var result =  stock - ingreso ;

            this.cosecha = {
              stock: result,
              idHis: historial.idHistorial,
              ingreso: historial.ingreso,
              fecha: historial.fecha,
              responsable: historial.responsable,
            }
            this.proveedor.ActualizarCosechaHistorial('cosechaHistorial/delete/', historial.id,this.cosecha).then(data => {
              console.log(data);
              if (this.proveedor.status) {
                this.loadDatos();
                this.MensajeServidor();
              } else {
                this.ErrorMensajeServidor();
                return;
              }
            }).catch(data => {
              console.log(data);
            });
          }
        }
      ]
    });

    await alert.present();
  }




  async ModelPresent(){
    const modal = await this.modalController.create({
      component: ModalCosechaPage,
      cssClass: 'modalCosecha',
      componentProps:{
        'Historial':this.historial,
        'type':'Editar Registro',
        'accion': true,
      }
    });

    modal.onDidDismiss().then(data => {
      this.ionViewWillEnter();
    })

    return await modal.present();
  }

  async MensajeServidor(){
    const alert = await this.alertController.create({
      header: 'Accion',
      message: 'La operacion se completo con exito',
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
